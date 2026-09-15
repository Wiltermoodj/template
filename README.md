How to install Tale:

How to Install in Any Repository
Run this command from the root of any target repository:

bash
curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/template/main/.agents/skills/tale/scripts/install.sh | bash
To install into a specific directory path or globally:

bash

# Target repository path

curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/template/main/.agents/skills/tale/scripts/install.sh | bash -s -- --project /path/to/target

# Global agent configuration (~/.gemini/config/skills/tale)

curl -fsSL https://raw.githubusercontent.com/Wiltermoodj/template/main/.agents/skills/tale/scripts/install.sh | bash -s -- --global
