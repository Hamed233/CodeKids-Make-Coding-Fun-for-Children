# Contributing to CodeKids

Thank you for considering contributing to CodeKids! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a welcoming, inclusive, and respectful environment. Be kind and constructive in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. A clear, descriptive title
2. A detailed description of the bug
3. Steps to reproduce the issue
4. Expected vs actual behavior
5. Screenshots if applicable
6. Environment information (browser, OS, etc.)

### Suggesting Features

Feature suggestions are welcome! Create an issue with:

1. A clear, descriptive title
2. A detailed description of the proposed feature
3. Any relevant mockups or examples
4. An explanation of why this feature would be valuable to the project

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines

- Follow the existing code style
- Include tests for new features
- Update documentation as needed
- One pull request per feature/fix
- Keep pull requests focused on addressing a single concern
- Reference any relevant issues in your PR description

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Push database schema: `npm run db:push`
5. Start the development server: `npm run dev`

## Style Guidelines

- TypeScript: Follow existing codebase style and ESLint rules
- Components: Follow existing component patterns
- CSS: Use the established TailwindCSS patterns

## Testing

- Write tests for new features
- Ensure existing tests pass before submitting a PR
- Run tests with `npm test`

## Documentation

- Update README.md for significant changes
- Document new features, APIs, and components
- Include code comments where necessary to explain complex logic

## Commit Guidelines

- Use clear and descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused on specific changes

## License

By contributing to CodeKids, you agree that your contributions will be licensed under the project's MIT License.

Thank you for contributing to making coding education more accessible and enjoyable for children!