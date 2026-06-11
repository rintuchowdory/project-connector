# Project Connector

A modern full-stack web application built with React, TanStack Start, and Supabase. Project Connector provides a seamless integration platform for connecting and managing projects with AI-powered capabilities.

**Live Demo:** [https://friendly-forks.lovable.app](https://friendly-forks.lovable.app)

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe JavaScript development
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **Vite** - Next-generation build tool

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component library
- **Lucide React** - Beautiful icon library
- **Shadcn/ui components** - Pre-built Tailwind components

### Backend & Database
- **Supabase** - PostgreSQL backend with authentication
- **TanStack Query** - Server state management

### AI & Forms
- **AI SDK (OpenAI Compatible)** - AI integration
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Bun** - Fast JavaScript runtime and package manager

## 📋 Prerequisites

- Node.js 18+ or Bun
- npm/yarn/pnpm (or Bun)
- Supabase account (credentials in `.env`)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/rintuchowdory/project-connector.git
cd project-connector
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using Bun:
```bash
bun install
```

### 3. Environment Setup

Create a `.env` file in the project root with your Supabase credentials:

```env
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

## 🏃 Getting Started

### Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173` (or your configured Vite port).

### Production Build
```bash
npm run build
```

Build optimized files for production.

### Preview Production Build
```bash
npm run preview
```

### Code Quality

Format code with Prettier:
```bash
npm run format
```

Lint code with ESLint:
```bash
npm run lint
```

## 📁 Project Structure

```
project-connector/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── routes/           # TanStack Router routes
│   └── ...               # Application code
├── supabase/             # Supabase configuration & migrations
├── package.json          # Dependencies & scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── eslint.config.js      # ESLint configuration
```

## 🎨 Component Library

This project uses Radix UI with Tailwind CSS for a comprehensive component system including:
- Accordion, Alert Dialog, Avatar, Checkbox
- Collapsible, Context Menu, Dialog, Dropdown Menu
- Hover Card, Label, Menubar, Navigation Menu
- Popover, Progress, Radio Group, Scroll Area
- Select, Separator, Slider, Switch, Tabs
- Toggle, Toggle Group, Tooltip

## 🔐 Authentication

Authentication is handled through **Lovable Cloud Auth** and **Supabase**. Ensure your Supabase project is properly configured with authentication providers.

## 🤖 AI Integration

The project includes AI capabilities through the **Vercel AI SDK** with OpenAI-compatible endpoints. Configure your AI endpoints in the environment variables.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy
The built files in the `dist/` directory can be deployed to any static hosting platform:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Google Cloud Storage

## 📝 Code Conventions

- **TypeScript** - Strict mode enabled for type safety
- **Prettier** - Automatic code formatting on save
- **ESLint** - Enforces code quality rules
- **React Hooks** - Functional component patterns

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit: `git commit -m 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues, questions, or suggestions, please create an issue in the [GitHub repository](https://github.com/rintuchowdory/project-connector/issues).

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Vercel AI SDK](https://sdk.vercel.ai/)

---

**Last Updated:** June 2026

Built with ❤️ using modern web technologies.
