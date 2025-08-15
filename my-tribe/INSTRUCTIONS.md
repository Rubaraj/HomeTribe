# Project Instructions: my-tribe

This project is a [Next.js](https://nextjs.org) application bootstrapped with `create-next-app` and configured with Tailwind CSS and ESLint.

## Project Overview
This project is to create a consolidated social media app. Like linking Reddit, Instagram, Facebook, Thread and many More. 

## Project Structure

- `src/app/` - Main application code
  - `page.js` - Home page component
  - `layout.js` - Root layout, sets up fonts and global styles
  - `globals.css` - Global CSS, includes Tailwind and custom properties
  - `signup/page.js` - User signup page with social authentication
  - `components/` - Reusable components (AppHeader, AppFooter, ThemeToggle)
- `src/lib/` - Utility libraries and services
- `public/` - Static assets (SVGs, icons, brand assets)
- `package.json` - Project dependencies and scripts
- `jsconfig.json` - Path aliases for imports
- `next.config.mjs` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS (for Tailwind)
- `FIREBASE-INSTRUCTIONS.md` - Detailed Firebase database integration guide
- `DESIGN-INSTRUCTIONS.md` - Design system and UI guidelines
- `CHANGES.md` - Project change log

## Setup Instructions

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Run the development server:**
   ```powershell
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production:**
   ```powershell
   npm run build
   npm start
   ```

4. **Lint the code:**
   ```powershell
   npm run lint
   ```

## Database Integration

This project uses Google Firebase as the backend database solution. For detailed setup and integration instructions, see:

📄 **[FIREBASE-INSTRUCTIONS.md](./FIREBASE-INSTRUCTIONS.md)** - Complete guide for:
- Firebase project setup and configuration
- Firestore database integration
- Authentication with Google/Apple
- Security rules and best practices
- Code examples and implementation patterns

## Additional Documentation

- 📄 **[DESIGN-INSTRUCTIONS.md](./DESIGN-INSTRUCTIONS.md)** - Design system, color palette, and UI guidelines
- 📄 **[CHANGES.md](./CHANGES.md)** - Project change log and version history

## Notes
- Edit `src/app/page.js` to change the home page.
- Global styles and Tailwind config are in `src/app/globals.css`.
- Static files (SVGs, icons) are in the `public/` folder.
- Uses [Geist](https://vercel.com/font) font via `next/font`.

## Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/latest/)

---

For more details, see the `README.md` file.
