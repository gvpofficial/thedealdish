# Project Rule: Documentation & Legal Text Sync

This project requires that whenever updates are made to the website codebase (`index.html`, `style.css`, `app.js`), the corresponding documentation, terms, and specifications MUST be reviewed and kept in sync.

## Scope of Updates
1. **README.md Sync**:
   - If a new feature is added, update the **Key Features** section.
   - If dependencies, framework version, or tools are updated, update the **Tech Stack** section.
   - If credentials/accounts are changed in `app.js` (e.g., login accounts for Consumer, Hotel Partner, or Admin), update the **Demo Accounts & Credentials** section.
   - If new legal rules or auditing requirements (FSSAI) are added, update the **Legal & Compliance** section.

2. **Legal & Terms Sync (`app.js` -> `openLegalModal`)**:
   - If user registration data changes, update the **Privacy Policy** section in `app.js`.
   - If transaction, reservation, cancellation, or no-show rules are updated, update the **Terms of Service** section in `app.js`.
   - If `localStorage` keys or session management changes, update the **Cookie Settings** section in `app.js`.
   - If food safety validation or auditing processes change, update the **FSSAI Rules** section in `app.js`.

3. **Synopsis Documents (`THEDEALDISH_Synopsis.pdf`, `THEDEALDISH_Synopsis.docx`)**:
   - If major architectural or design changes occur, notify the user that the project synopsis files should be updated or regenerated.

## Automation & Warnings
- A git pre-commit hook is available at `.githooks/pre-commit` to warn the developer about unstaged documentation updates.
- Activate the hook by running:
  ```bash
  git config core.hooksPath .githooks
  ```
