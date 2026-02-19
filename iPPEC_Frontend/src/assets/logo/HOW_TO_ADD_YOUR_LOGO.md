# 🎨 How to Add Your New Logo to iPPEC System

## 📥 Step-by-Step Instructions:

### 1. **Receive Logo Files from Designer**
Ask your designer to provide:
- Main logo (SVG and PNG formats)
- Icon version (for small spaces)
- Favicon (for browser tabs)
- Color codes (hex values)

### 2. **Add Files to Logo Folder**
Place your files in: `src/assets/logo/`

Recommended file names:
```
src/assets/logo/
├── ippec-logo.svg          (main logo)
├── ippec-logo.png          (backup)
├── ippec-icon.svg          (icon only)
├── ippec-icon.png          (backup)
├── favicon.svg             (browser tab)
└── logo-config.ts          (configuration)
```

### 3. **Update Configuration**
Edit `src/assets/logo/logo-config.ts`:

```typescript
// Update these paths to match your file names
export const LOGO_PATHS = {
  MAIN_LOGO: '/src/assets/logo/your-logo-name.svg',
  LOGO_ICON: '/src/assets/logo/your-icon-name.svg',
  FAVICON: '/src/assets/logo/your-favicon.svg',
};

// Update colors if provided by designer
export const LOGO_CONFIG = {
  USE_DESIGNED_LOGO: true,  // Change this to true!
  COLORS: {
    PRIMARY_BLUE: '#YOUR_BLUE_COLOR',
    MEDICAL_GREEN: '#YOUR_GREEN_COLOR',
    // ... other colors
  },
};
```

### 4. **Update Favicon**
Replace `public/favicon.svg` with your new favicon file.

### 5. **Test the System**
- Refresh your browser
- Check all pages: Home, About, Services, Contact
- Verify login/register pages
- Check browser tab icon

## 🔄 **Automatic Updates**

Once you complete these steps, your new logo will automatically appear in:
- ✅ Header navigation
- ✅ Footer
- ✅ Homepage hero section
- ✅ Login/register forms
- ✅ Browser tab (favicon)
- ✅ All future components

## 🚨 **Need Help?**

If you encounter any issues:
1. Check file paths in `logo-config.ts`
2. Ensure files are in correct folder
3. Verify `USE_DESIGNED_LOGO: true`
4. Ask for assistance if needed

---

**Current Status:** Ready for your designer's logo files!
**Next Step:** Wait for designer's files, then follow steps above.