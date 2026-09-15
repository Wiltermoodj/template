import assert from "node:assert";
import {
  calculateSTEWordCount,
  splitIntoSentences,
  extractCodeComments,
  lintSTE,
  autoFixContent,
} from "./tale-lint.mjs";

console.log("Running TALE Linter Test Suite...\n");

// 1. Double Possessive Bug Test
{
  const text = "The user's cart and the store's inventory is low.";
  const count = calculateSTEWordCount(text);
  // tokens: The, user's, cart, and, the, store's, inventory, is, low = 9 tokens
  assert.strictEqual(count, 9, `Expected 9 words for double possessives, got ${count}`);
  console.log("✓ Test 1 Passed: Double possessive does not wipe out inner words.");
}

// 2. Abbreviation Sentence Splitting Test
{
  const content = "Use a valid tool (e.g. Node or Npm) for this task.\nThen continue.";
  const sentences = splitIntoSentences(content);
  assert.strictEqual(sentences.length, 2, `Expected 2 sentences, got ${sentences.length}`);
  assert.ok(
    sentences[0].text.includes("(e.g. Node or Npm)"),
    `Expected first sentence to retain full abbreviation clause: "${sentences[0].text}"`
  );
  console.log("✓ Test 2 Passed: Sentence splitter protects e.g. from premature splitting.");
}

// 3. HTML Entity Semicolon Test
{
  const text = "Use &amp; and &quot; in XML files.";
  const issues = lintSTE(text, false);
  const semiIssue = issues.find((i) => i.rule === "Rule 8.1");
  assert.ok(!semiIssue, "HTML entities should not trigger Rule 8.1 semicolon violation");
  console.log("✓ Test 3 Passed: HTML entities (&amp;, &quot;) do not trigger semicolon violations.");
}

// 4. URL False Positive Test
{
  const text = "Read https://example.com/avoid/ensure?id=1;mode=all for instructions.";
  const issues = lintSTE(text, false);
  const falsePositives = issues.filter(
    (i) => i.rule === "Rule 8.1" || i.rule === "Part 2 Dictionary"
  );
  assert.strictEqual(
    falsePositives.length,
    0,
    `URLs should not trigger dictionary or semicolon false positives: ${JSON.stringify(falsePositives)}`
  );
  console.log("✓ Test 4 Passed: URL paths and queries do not trigger false positives.");
}

// 5. Blockquote Linting Test
{
  const content = "> [!NOTE]\n> Ensure that the database connection is open; otherwise abort.";
  const issues = lintSTE(content, false);
  assert.ok(
    issues.some((i) => i.rule === "Rule 8.1"),
    "Blockquotes with semicolons must be flagged"
  );
  assert.ok(
    issues.some((i) => i.rule === "Part 2 Dictionary"),
    "Blockquotes with 'Ensure' must be flagged"
  );
  console.log("✓ Test 5 Passed: Blockquotes and GitHub callouts are properly linted.");
}

// 6. Progressive Tense Detection Test
{
  const text = "The worker was testing the engine.";
  const issues = lintSTE(text, false);
  const progIssue = issues.find((i) => i.rule === "Rule 1.6 / Rule 6");
  assert.ok(progIssue, "Progressive verbs ('was testing') must be flagged");
  console.log("✓ Test 6 Passed: Progressive verb ('was testing') caught under Rule 1.6 / Rule 6.");
}

// 7. Expanded Inflections Test
{
  const text = "The agent ensured that the engine rotated clockwise.";
  const issues = lintSTE(text, false);
  assert.ok(
    issues.some((i) => i.message.includes("ensured")),
    "Past tense 'ensured' must be flagged"
  );
  assert.ok(
    issues.some((i) => i.message.includes("rotated")),
    "Past tense 'rotated' must be flagged"
  );
  console.log("✓ Test 7 Passed: Past-tense inflections ('ensured', 'rotated') caught.");
}

// 8. Code String Extraction Test
{
  const code = `
const url = "//not a comment; ensure this";
// This is a real comment.
`;
  const comments = extractCodeComments(code);
  assert.strictEqual(comments.length, 1, `Expected 1 real comment, got ${comments.length}`);
  assert.strictEqual(comments[0].text, "This is a real comment.");
  console.log("✓ Test 8 Passed: String literals containing '//' are not treated as comments.");
}

// 9. Auto-Fix Remediation Test
{
  const content = "The user can't ensure that e.g. the service is up.";
  const { fixed, fixCount } = autoFixContent(content);
  assert.ok(fixCount >= 3, `Expected at least 3 fixes, got ${fixCount}`);
  assert.ok(fixed.includes("cannot"), "can't should be fixed to cannot");
  assert.ok(fixed.includes("make sure that"), "ensure should be fixed to make sure that");
  assert.ok(fixed.includes("for example"), "e.g. should be fixed to for example");
  console.log("✓ Test 9 Passed: Auto-fix correctly remediates contractions, Latin, and safe terms.");
}

console.log("\nAll 9 unit tests passed successfully!");
