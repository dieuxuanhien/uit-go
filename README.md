# UIT-GO Nx Monorepo

This is a modern Nx monorepo workspace for UIT-GO projects, providing powerful tools for managing multiple applications and shared libraries.

## 🚀 Getting Started

### Prerequisites
- Node.js (>=18.x)
- npm or yarn

### Installation
```bash
npm install
```

## 📁 Project Structure

```
uit-go/
├── apps/                 # Applications
│   └── sample-app/       # Sample Node.js application
├── libs/                 # Shared libraries
│   └── shared-utils/     # Common utilities
├── tools/                # Development tools and scripts
├── nx.json              # Nx workspace configuration
├── tsconfig.base.json   # Base TypeScript configuration
└── package.json         # Root package.json
```

## 🛠 Available Commands

### Build
```bash
# Build all projects
npm run build

# Build specific project
npx nx build <project-name>

# Build affected projects
npm run affected:build
```

### Test
```bash
# Test all projects
npm run test

# Test specific project
npx nx test <project-name>

# Test affected projects
npm run affected:test
```

### Lint
```bash
# Lint all projects
npm run lint

# Lint specific project
npx nx lint <project-name>

# Lint affected projects
npm run affected:lint
```

### Development
```bash
# Serve sample application
npx nx serve sample-app

# Run development mode
npx nx serve sample-app --configuration=development
```

## 📊 Workspace Analysis

### View dependency graph
```bash
npm run dep-graph
```

### Show affected projects
```bash
npx nx affected:apps
npx nx affected:libs
```

## 🏗 Creating New Projects

### Generate new application
```bash
npx nx g @nx/node:app <app-name>
```

### Generate new library
```bash
npx nx g @nx/js:lib <lib-name>
```

## 🎯 Key Features

- **Smart Builds**: Only build what's affected by your changes
- **Distributed Caching**: Cache build results across your team
- **Dependency Graph**: Visualize project relationships
- **Code Generation**: Scaffold new projects with consistent structure
- **Parallel Execution**: Run tasks in parallel for better performance

## 📚 Example Usage

The sample application demonstrates how to:
- Import shared utilities from the libs
- Set up proper TypeScript path mapping
- Configure build dependencies

## 🔧 Configuration

- `nx.json`: Nx workspace configuration
- `tsconfig.base.json`: Shared TypeScript configuration
- Individual `project.json` files: Project-specific configuration

## 📖 Learn More

- [Nx Documentation](https://nx.dev)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)