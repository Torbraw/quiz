# AGENTS.md

## Build & Development Commands

- `bun dev` / `bun start` - Start Astro dev server
- `bun run build` - Type check (`astro check`) and build for production
- `bun run format` - Format with Prettier + Biome
- No test framework configured

## Tech Stack

Astro + SolidJS + TailwindCSS + TypeScript (strictest mode)

## Code Style (Biome + Prettier)

- **Line width:** 120 chars, **Indent:** 2 spaces, **Line endings:** CRLF
- **Semicolons:** Always, **Quotes:** Double quotes, **Trailing commas:** Always
- Biome handles JS/TS/JSON; Prettier handles .astro files

## TypeScript & Types

- Use `type` keyword for type definitions (not `interface`)
- Props defined as `type Props = { ... }` above components
- Import types with `import type { X }` or `type` modifier in destructuring
- SolidJS components typed as `Component<Props>`

## Naming Conventions

- Components: PascalCase (`Question.tsx`, `GameOptions.tsx`)
- Files: kebab-case for non-components (`language-select.tsx`, `base-layout.astro`)
- Types: PascalCase (`GameOptions`, `QuestionWithId`)

## SolidJS Patterns

- Wrap props in accessor functions: `const foo = () => props.foo`
- Use `<Show>`, `<Switch>`, `<Match>` for conditional rendering
- Use `classList` for conditional classes
