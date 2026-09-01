# Contributing to eProperty

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests
6. Submit a pull request

## Development Setup

```bash
./scripts/setup-dev.sh
```

## Code Style

### Backend (PHP)
- Follow PSR-12 coding standard
- Use type hints for all function parameters and return types
- Write PHPDoc blocks for classes and methods
- Use strict types: `declare(strict_types=1);`

### Frontend (TypeScript)
- Use TypeScript strict mode
- Follow Airbnb style guide
- Use functional components with hooks
- Write JSDoc comments for complex functions

## Testing

### Backend
```bash
cd services/identity-service
php artisan test
```

### Frontend
```bash
cd web
npm test
```

## Commit Messages

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for refactoring
- `test:` for tests
- `chore:` for maintenance

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## License

By contributing, you agree that your contributions will be licensed under the project license.
