#!/usr/bin/env node
/**
 * ASD-STE100 Issue 9 Linter for Markdown and Technical Text.
 *
 * Checks text and code comments against ASD-STE100 Issue 9 rules:
 * - Prohibits semicolons (Rule 8.1).
 * - Prohibits contractions (Rule 4.2).
 * - Prohibits Latin abbreviations (GR-6).
 * - Enforces sentence length limits:
 *     - Procedural (lists/steps): <= 20 words (Rule 5.1).
 *     - Descriptive: <= 25 words (Rule 6.3).
 * - Flags unapproved high-frequency non-STE words from Recurring Errors (Part 2).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";

export interface STEIssue {
  lineNum: number;
  rule: string;
  message: string;
  context: string;
}

export interface FileReport {
  filePath: string;
  issues: STEIssue[];
}

export const RECURRING_ERRORS: Record<string, string> = {
  "\\bacceptable\\b": "PERMITTED",
  "\\balternate\\b": "ALTERNATIVE",
  "\\bavoid\\b": "PREVENT",
  "\\bboth\\b": "THE TWO",
  "\\bcomplete\\b": "COMPLETED",
  "\\bensure\\b": "MAKE SURE",
  "\\bensures\\b": "MAKES SURE",
  "\\bensuring\\b": "MAKING SURE",
  "\\bfurther\\b": "MORE",
  "\\bhave to\\b": "MUST / Use imperative form",
  "\\bhowever\\b": "BUT",
  "\\bmain\\b": "PRIMARY",
  "\\bmay\\b": "CAN",
  "\\bneed to\\b": "NECESSARY (e.g. 'It is necessary to...')",
  "\\bpeople\\b": "PERSON / PERSONNEL",
  "\\bperform\\b": "DO",
  "\\bperforms\\b": "DOES",
  "\\bperformed\\b": "DID",
  "\\bperforming\\b": "DOING",
  "\\bportion\\b": "PART",
  "\\bportions\\b": "PARTS",
  "\\bpress\\b": "PUSH",
  "\\bpresses\\b": "PUSHES",
  "\\bpressing\\b": "PUSHING",
  "\\breach\\b": "GET TO",
  "\\breaches\\b": "GETS TO",
  "\\breaching\\b": "GETTING TO",
  "\\brepeat\\b": "DO ... AGAIN",
  "\\brepeats\\b": "DOES ... AGAIN",
  "\\brotate\\b": "TURN",
  "\\brotates\\b": "TURNS",
  "\\brotating\\b": "TURNING",
  "\\bsecure\\b": "ATTACH / SAFETY",
  "\\bsecures\\b": "ATTACHES",
  "\\bsecuring\\b": "ATTACHING",
  "\\bshall\\b": "MUST",
  "\\bshould\\b": "MUST",
  "\\btherefore\\b": "THUS / AS A RESULT",
  "\\butilize\\b": "USE",
  "\\butilizes\\b": "USES",
  "\\butilized\\b": "USED",
  "\\butilizing\\b": "USING",
  "\\bwear\\b": "PUT ON / USE",
  "\\bwears\\b": "PUTS ON / USES",
  "\\bwearing\\b": "PUTTING ON / USING",
};

export const CONTRACTIONS: string[] = [
  "\\bcan't\\b",
  "\\bdon't\\b",
  "\\bdoesn't\\b",
  "\\bdidn't\\b",
  "\\bwon't\\b",
  "\\bwouldn't\\b",
  "\\bshouldn't\\b",
  "\\bcouldn't\\b",
  "\\bisn't\\b",
  "\\baren't\\b",
  "\\bwasn't\\b",
  "\\bweren't\\b",
  "\\bhasn't\\b",
  "\\bhaven't\\b",
  "\\bhadn't\\b",
  "\\blet's\\b",
  "\\bit's\\b",
  "\\bthat's\\b",
  "\\bthere's\\b",
  "\\bthey're\\b",
  "\\bwe're\\b",
  "\\byou're\\b",
  "\\bi'm\\b",
  "\\byou've\\b",
  "\\bwe've\\b",
  "\\bthey've\\b",
  "\\bi've\\b",
  "\\byou'll\\b",
  "\\bhe'll\\b",
  "\\bshe'll\\b",
  "\\bwe'll\\b",
  "\\bthey'll\\b",
];

export const LATIN_ABBREVIATIONS: Record<string, string> = {
  "\\be\\.g\\.\\b": "for example",
  "\\be\\.g\\b": "for example",
  "\\bi\\.e\\.\\b": "that is",
  "\\bi\\.e\\b": "that is",
  "\\betc\\.\\b": "and so on",
  "\\betc\\b": "and so on",
  "\\bvia\\b": "through / by",
  "\\bvs\\.\\b": "compared with / against",
  "\\bvs\\b": "compared with / against",
};

/**
 * Calculates sentence word count obeying ASD-STE100 Section 8:
 * - Parentheses count as 1 word in the parent sentence.
 * - Numbers with units (e.g. '10 mA', '500 ms', '$100.00') count as 1 word.
 * - Quoted text counts as 1 word.
 * - Hyphenated words count as 1 word.
 */
export function calculateSTEWordCount(sentence: string): number {
  let text = sentence;

  // Replace quoted strings with a single token
  text = text.replace(/"[^"]*"/g, " QUOTED_TOKEN ");
  text = text.replace(/'[^']*'/g, " QUOTED_TOKEN ");

  // Replace parenthetical clauses with a single token (Rule 8.5)
  text = text.replace(/\([^)]*\)/g, " PAREN_TOKEN ");

  // Replace number + unit of measurement (Rule 8.6)
  text = text.replace(
    /\b\d+(\.\d+)?\s*(mA|ms|s|min|h|mm|cm|m|km|kg|g|psi|V|A|Byte|MB|GB|KB|%|cents|USD)\b/gi,
    " UNIT_TOKEN "
  );

  // Split on whitespace
  const tokens = text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && /[a-zA-Z0-9]/.test(t));

  return tokens.length;
}

export interface ParsedSentence {
  text: string;
  lineNum: number;
  isListItem: boolean;
}

/**
 * Parses markdown text into sentences while properly handling:
 * - YAML frontmatter skipping
 * - Fenced code blocks skipping
 * - Headers, tables, and blockquotes skipping
 * - Multi-line paragraph buffering (prevents soft-wrapped lines from splitting sentences)
 * - Markdown links and code spans normalization
 */
export function splitIntoSentences(content: string): ParsedSentence[] {
  const sentences: ParsedSentence[] = [];
  const lines = content.split(/\r?\n/);

  let inFrontmatter = false;
  let inCodeBlock = false;

  interface Block {
    lines: { text: string; lineNum: number }[];
    isListItem: boolean;
  }

  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const stripped = rawLine.trim();
    const lineNum = idx + 1;

    // Track YAML frontmatter
    if (idx === 0 && stripped === "---") {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (stripped === "---") {
        inFrontmatter = false;
      }
      continue;
    }

    // Track fenced code blocks
    if (stripped.startsWith("```") || stripped.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    if (inCodeBlock) {
      continue;
    }

    // Skip empty lines (paragraph boundary)
    if (!stripped) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Skip Markdown headers, tables, HTML comments, blockquote citations/examples
    if (
      stripped.startsWith("#") ||
      stripped.startsWith("|") ||
      stripped.startsWith("![") ||
      stripped.startsWith(">") ||
      stripped.startsWith("<!--") ||
      stripped.includes("Non-STE:") ||
      stripped.includes("*Non-STE:*")
    ) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    const isListItem = /^(\*|-|\+|\d+\.)\s+/.test(stripped);

    if (isListItem) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        lines: [{ text: stripped.replace(/^(\*|-|\+|\d+\.)\s+/, ""), lineNum }],
        isListItem: true,
      };
    } else {
      if (!currentBlock) {
        currentBlock = {
          lines: [{ text: stripped, lineNum }],
          isListItem: false,
        };
      } else {
        currentBlock.lines.push({ text: stripped, lineNum });
      }
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  for (const block of blocks) {
    const startLineNum = block.lines[0].lineNum;
    let fullText = block.lines.map((l) => l.text).join(" ");
    fullText = fullText.replace(/`[^`]*`/g, " CODE_SPAN ");
    fullText = fullText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    fullText = fullText.replace(/\*\([^*]*\)\*/g, "");

    const rawSentences = fullText.split(/(?<=[.!?])\s+(?=[A-Z0-9"]|$)/);
    for (const raw of rawSentences) {
      const s = raw.trim();
      if (s.length > 0) {
        sentences.push({
          text: s,
          lineNum: startLineNum,
          isListItem: block.isListItem,
        });
      }
    }
  }

  return sentences;
}

/**
 * Extracts comments and docstrings from TypeScript/JavaScript source code.
 */
export function extractCodeComments(content: string): ParsedSentence[] {
  const sentences: ParsedSentence[] = [];
  const lines = content.split(/\r?\n/);

  let inBlockComment = false;
  interface CommentBlock {
    lines: { text: string; lineNum: number }[];
  }
  const blocks: CommentBlock[] = [];
  let currentBlock: CommentBlock | null = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const lineNum = idx + 1;
    const stripped = rawLine.trim();

    // Handle inside block comment
    if (inBlockComment) {
      if (stripped.includes("*/")) {
        inBlockComment = false;
        const commentPart = stripped
          .substring(0, stripped.indexOf("*/"))
          .replace(/^\*+\s?/, "")
          .trim();
        if (commentPart && !commentPart.startsWith("@")) {
          if (!currentBlock) currentBlock = { lines: [] };
          currentBlock.lines.push({ text: commentPart, lineNum });
        }
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
      } else {
        const commentPart = stripped.replace(/^\*+\s?/, "").trim();
        if (commentPart && !commentPart.startsWith("@")) {
          if (!currentBlock) currentBlock = { lines: [] };
          currentBlock.lines.push({ text: commentPart, lineNum });
        }
      }
      continue;
    }

    // Handle block comment start
    if (stripped.startsWith("/*")) {
      if (stripped.includes("*/")) {
        const inner = stripped
          .replace(/^\/\*+/, "")
          .replace(/\*+\/$/, "")
          .trim();
        if (inner && !inner.startsWith("@")) {
          blocks.push({ lines: [{ text: inner, lineNum }] });
        }
      } else {
        inBlockComment = true;
        const inner = stripped.replace(/^\/\*+/, "").trim();
        if (inner && !inner.startsWith("@")) {
          currentBlock = { lines: [{ text: inner, lineNum }] };
        }
      }
      continue;
    }

    // Handle single line comment
    const commentIdx = rawLine.indexOf("//");
    if (commentIdx !== -1) {
      const before = rawLine.substring(0, commentIdx);
      if (!before.includes("http:") && !before.includes("https:")) {
        const commentText = rawLine.substring(commentIdx + 2).trim();
        if (
          commentText &&
          !commentText.startsWith("eslint-") &&
          !commentText.startsWith("@ts-") &&
          !commentText.startsWith("prettier-ignore")
        ) {
          if (!currentBlock) {
            currentBlock = { lines: [{ text: commentText, lineNum }] };
          } else {
            currentBlock.lines.push({ text: commentText, lineNum });
          }
          continue;
        }
      }
    }

    if (currentBlock) {
      blocks.push(currentBlock);
      currentBlock = null;
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  for (const block of blocks) {
    const startLineNum = block.lines[0].lineNum;
    let fullText = block.lines.map((l) => l.text).join(" ");
    fullText = fullText.replace(/`[^`]*`/g, " CODE_SPAN ");

    const rawSentences = fullText.split(/(?<=[.!?])\s+(?=[A-Z0-9"]|$)/);
    for (const raw of rawSentences) {
      const s = raw.trim();
      if (s.length > 0) {
        sentences.push({
          text: s,
          lineNum: startLineNum,
          isListItem: false,
        });
      }
    }
  }

  return sentences;
}

/**
 * Lints given text content against ASD-STE100 Issue 9 rules.
 */
export function lintSTE(content: string, isCodeFile = false): STEIssue[] {
  const issues: STEIssue[] = [];
  const sentences = isCodeFile
    ? extractCodeComments(content)
    : splitIntoSentences(content);

  for (const item of sentences) {
    const { text, lineNum, isListItem } = item;

    // Rule 8.1: Semicolons
    if (text.includes(";")) {
      issues.push({
        lineNum,
        rule: "Rule 8.1",
        message: "Semicolons (;) are strictly prohibited. Split into separate sentences.",
        context: text,
      });
    }

    // Rule 4.2: Contractions
    for (const pattern of CONTRACTIONS) {
      const regex = new RegExp(pattern, "i");
      const match = text.match(regex);
      if (match) {
        issues.push({
          lineNum,
          rule: "Rule 4.2",
          message: `Contraction '${match[0]}' found. Contractions are prohibited in STE.`,
          context: text,
        });
      }
    }

    // GR-6: Latin abbreviations
    for (const [pattern, replacement] of Object.entries(LATIN_ABBREVIATIONS)) {
      const regex = new RegExp(pattern, "i");
      const match = text.match(regex);
      if (match) {
        issues.push({
          lineNum,
          rule: "GR-6",
          message: `Latin abbreviation '${match[0]}' found. Use '${replacement}' instead.`,
          context: text,
        });
      }
    }

    // Part 2: Recurring Errors Dictionary
    for (const [pattern, replacement] of Object.entries(RECURRING_ERRORS)) {
      const regex = new RegExp(pattern, "i");
      const match = text.match(regex);
      if (match) {
        issues.push({
          lineNum,
          rule: "Part 2 Dictionary",
          message: `Unapproved word '${match[0]}' found. Use approved alternative '${replacement}'.`,
          context: text,
        });
      }
    }

    // Rules 5.1 & 6.3: Sentence Length Limits
    const wordCount = calculateSTEWordCount(text);
    if (isListItem) {
      if (wordCount > 20) {
        issues.push({
          lineNum,
          rule: "Rule 5.1",
          message: `Procedural sentence has ${wordCount} words (Maximum allowed is 20 words).`,
          context: text,
        });
      }
    } else {
      if (wordCount > 25) {
        issues.push({
          lineNum,
          rule: "Rule 6.3",
          message: `Descriptive sentence has ${wordCount} words (Maximum allowed is 25 words).`,
          context: text,
        });
      }
    }
  }

  return issues;
}

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);
const DOC_EXTENSIONS = new Set([".md", ".markdown"]);

function collectFiles(
  targetPath: string,
  mode: "docs" | "code" | "all"
): { filePath: string; isCode: boolean }[] {
  if (!fs.existsSync(targetPath)) return [];
  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    const ext = path.extname(targetPath).toLowerCase();
    const isCode = CODE_EXTENSIONS.has(ext);
    const isDoc = DOC_EXTENSIONS.has(ext);
    if (isCode || isDoc) {
      return [{ filePath: targetPath, isCode }];
    }
    return [];
  }

  if (stat.isDirectory()) {
    const results: { filePath: string; isCode: boolean }[] = [];
    const entries = fs.readdirSync(targetPath, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name.startsWith(".") ||
        entry.name === "node_modules" ||
        entry.name === "dist" ||
        entry.name === "coverage"
      ) {
        continue;
      }
      const full = path.join(targetPath, entry.name);
      if (entry.isDirectory()) {
        results.push(...collectFiles(full, mode));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const isCode = CODE_EXTENSIONS.has(ext);
        const isDoc = DOC_EXTENSIONS.has(ext);

        if (mode === "all" && (isCode || isDoc)) {
          results.push({ filePath: full, isCode });
        } else if (mode === "code" && isCode) {
          results.push({ filePath: full, isCode: true });
        } else if (mode === "docs" && isDoc) {
          results.push({ filePath: full, isCode: false });
        }
      }
    }
    return results;
  }

  return [];
}

export function runCLI(argv: string[]): void {
  const args = argv.slice(2);
  let textInput: string | null = null;
  let jsonOutput = false;
  let mode: "docs" | "code" | "all" = "docs";
  const paths: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--text" || arg === "-t") {
      textInput = args[++i];
    } else if (arg === "--json") {
      jsonOutput = true;
    } else if (arg === "--code" || arg === "-c") {
      mode = "code";
    } else if (arg === "--all" || arg === "-a") {
      mode = "all";
    } else if (arg.startsWith("--mode=")) {
      mode = arg.split("=")[1] as "docs" | "code" | "all";
    } else if (arg === "--help" || arg === "-h") {
      console.log(`ASD-STE100 Issue 9 Linter (Node.js/TypeScript)

Usage:
  node ste-lint.mjs [options] [files/directories...]

Options:
  -t, --text <STRING>   Lint direct text string input
  -c, --code            Scan code comments in TypeScript/JavaScript files (.ts, .tsx, .js)
  -a, --all             Scan both documentation (.md) and code comments (.ts, .js)
  --json                Output results in JSON format
  -h, --help            Show this help message
`);
      process.exit(0);
    } else {
      paths.push(arg);
    }
  }

  const reports: FileReport[] = [];
  let totalViolations = 0;

  if (textInput !== null) {
    const isCode = textInput.startsWith("//") || textInput.startsWith("/*");
    const issues = lintSTE(textInput, isCode);
    totalViolations += issues.length;
    reports.push({ filePath: "inline-text", issues });

    if (jsonOutput) {
      console.log(JSON.stringify(reports, null, 2));
    } else {
      if (issues.length === 0) {
        console.log("✓ Text is fully ASD-STE100 Issue 9 compliant.");
      } else {
        console.log(`Found ${issues.length} STE violation(s):`);
        for (const issue of issues) {
          console.log(`  Line ${issue.lineNum} [${issue.rule}]: ${issue.message}`);
          console.log(`  -> "${issue.context}"`);
        }
      }
    }
    process.exit(totalViolations > 0 ? 1 : 0);
  }

  if (paths.length === 0) {
    console.error("Error: No files or directories provided to lint. Run with --help for usage.");
    process.exit(1);
  }

  const targets: { filePath: string; isCode: boolean }[] = [];
  for (const p of paths) {
    targets.push(...collectFiles(p, mode));
  }

  if (targets.length === 0) {
    console.error("No matching documentation or code files found.");
    process.exit(1);
  }

  for (const target of targets) {
    try {
      const content = fs.readFileSync(target.filePath, "utf-8");
      const issues = lintSTE(content, target.isCode);
      totalViolations += issues.length;
      reports.push({ filePath: target.filePath, issues });

      if (!jsonOutput) {
        console.log(`\nScanning: ${target.filePath} ${target.isCode ? "(Code Comments)" : "(Docs)"}`);
        if (issues.length === 0) {
          console.log("  ✓ Fully ASD-STE100 Issue 9 compliant.");
        } else {
          console.log(`  Found ${issues.length} STE violation(s):`);
          for (const issue of issues) {
            console.log(`    Line ${issue.lineNum} [${issue.rule}]: ${issue.message}`);
            console.log(`    -> "${issue.context}"`);
          }
        }
      }
    } catch (err) {
      console.error(`Error reading ${target.filePath}:`, err);
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify(reports, null, 2));
  } else {
    if (totalViolations > 0) {
      console.log(`\nTotal STE violations found: ${totalViolations}`);
    } else {
      console.log("\nAll scanned files are compliant with ASD-STE100 Issue 9.");
    }
  }

  process.exit(totalViolations > 0 ? 1 : 0);
}

runCLI(process.argv);
