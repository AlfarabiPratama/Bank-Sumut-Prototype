---
description: How to start and run the SULTAN development server
---

# Running the Development Server

## Quick Start

// turbo-all
1. Open terminal in project directory

2. Install dependencies (if first time or after pulling updates):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open browser to the URL shown (usually http://localhost:3000 or http://localhost:3001)

## Switching Views

The app has two main views accessible via the floating button (bottom-right):

- **📱 Smartphone icon**: Mobile Gen-Z banking interface
- **🖥️ Monitor icon**: Admin CRM Dashboard

## Common Issues

### Port Already in Use
If port 3000 is busy, Vite automatically uses next available port (3001, 3002, etc.)

### Blank Page
Check browser console for errors. Common fixes:
- Ensure `npm install` completed successfully
- Check if `index.css` is imported in `index.tsx`
- Verify no JSX syntax errors in components

### Tailwind Styles Not Working
- Verify `tailwind.config.js` exists with correct content paths
- Check `index.css` has `@tailwind base/components/utilities` directives
- Restart dev server after config changes

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Preview Production Build

```bash
npm run preview
```
