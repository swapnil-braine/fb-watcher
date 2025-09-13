# FB Watcher

A powerful Facebook analytics tool built with Next.js, TypeScript, and Tailwind CSS for monitoring and tracking Facebook activity.

## 🚀 Features

- **Real-time Monitoring** - Track Facebook activity in real-time
- **Analytics Dashboard** - Comprehensive insights and performance metrics
- **Engagement Tracking** - Monitor likes, comments, shares, and more
- **Custom Alerts** - Set up notifications for specific activities
- **Data Export** - Export data in various formats
- **Secure & Private** - Enterprise-grade privacy protection
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── CTA.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── Navbar.tsx
├── lib/                   # Utility functions
│   └── utils.ts
└── types/                 # TypeScript type definitions
    └── index.ts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fb-watcher
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` to customize the design system
- Update `src/app/globals.css` for global styles
- Use Tailwind utility classes in components

### Components
- Add new components in `src/components/`
- Follow the existing component structure
- Use TypeScript for props and state

### Pages
- Add new pages in `src/app/`
- Follow the App Router conventions
- Use the layout system for consistent structure

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- Build the project: `npm run build`
- Deploy the `.next` folder to your hosting platform

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
