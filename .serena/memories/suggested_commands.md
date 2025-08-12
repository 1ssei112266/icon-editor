# Essential Development Commands

## Development
```bash
npm run dev          # Start development server
npm run build        # Production build + TypeScript check
npm run lint         # ESLint code quality check
npm run preview      # Preview production build
```

## Git Workflow
```bash
git checkout main
git pull origin main
git checkout -b feature/feature-name
# ... development work ...
npm run lint && npm run build  # ALWAYS before commit
git add .
git commit -m "descriptive message"
git push -u origin feature/feature-name
```

## Critical Rules
- ALWAYS run `npm run lint` and `npm run build` before committing
- Use feature branches for all development
- Create descriptive commit messages in Japanese
- Test functionality before pushing