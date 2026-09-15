How to install Tale:

How to Install in Any Repository
Run this command from the root of any target repository:

```bash
curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/template/main/.agents/skills/tale/scripts/install.sh | bash
```

Install stubs:

```Bash
npm i -D github:Wiltermoodj/stubs && npx stubs init && npx stubs map --scaffold && npx stubs scan && npx stubs tree --graph
```

Alternative (no local node_modules install):
```Bash
npx -y github:Wiltermoodj/stubs install && stubs init && stubs map --scaffold && stubs scan && stubs tree --graph
```

Install Design:
```Bash
curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/design/main/scripts/install-design-skill.sh | bash
```
