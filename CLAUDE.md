# CLAUDE.md

This repository follows an Architect → Builder workflow.

Before making architectural changes, read PROJECT_CONTEXT.md and confirm the change is intentional.

## Naming conventions

* Use camelCase for variables and functions
* Use PascalCase for Vue components
* Prefer descriptive, readable names

## Vue/Nuxt conventions

* Prefer Composition API with `<script setup>`
* Follow idiomatic Nuxt patterns
* Keep components small and focused
* Use composables for shared logic
* Avoid direct DOM manipulation

## Complexity guidelines

* Prefer simple solutions over clever abstractions
* Avoid unnecessary dependencies
* Optimize for readability and maintainability
* Do not introduce enterprise-scale patterns

## Documentation rules

* Update PROJECT_CONTEXT.md when architecture changes
* Update README.md when setup changes
* Record major decisions in DEV_NOTES.md
* Add an entry to CHANGELOG.md for major milestones and architectural changes

When starting a session, read PROJECT_CONTEXT.md and README.md to restore context.

Do not refactor large portions of the project without explicit approval.

When external manual setup is required (Notion, Vercel, etc.), clearly label it as a MANUAL STEP and wait for confirmation before proceeding
