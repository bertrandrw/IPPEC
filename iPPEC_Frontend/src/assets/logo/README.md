# iPPEC Logo Management

## 📁 Logo Folder Structure

This folder is designed to hold all your logo files from the designers.

### 📋 Instructions:

1. **Add Your Logo Files Here:**
   - Place your designer's logo files in this folder
   - Recommended file names:
     - `ippec-logo.svg` (main logo)
     - `ippec-logo.png` (main logo PNG backup)
     - `ippec-icon.svg` (icon only)
     - `ippec-icon.png` (icon only PNG backup)
     - `favicon.svg` (for browser tab)

2. **Update Configuration:**
   - Edit `logo-config.ts` to match your file names
   - Update colors if designers provide specific color codes
   - Set `USE_DESIGNED_LOGO: true`

3. **Logo Sizes (if provided):**
   - Small: `ippec-logo-small.svg`
   - Medium: `ippec-logo-medium.svg` 
   - Large: `ippec-logo-large.svg`

### 🎨 Logo Requirements:

Ask your designers to provide:
- **SVG format** (preferred for scalability)
- **PNG format** (backup/fallback)
- **Multiple sizes** if needed
- **Favicon** (32x32px, 16x16px)
- **Color specifications** (hex codes)

### 🔄 How It Works:

Once you add your logo files:
1. Update `logo-config.ts`
2. The entire system will automatically use your new logo
3. Logo appears in:
   - Header navigation
   - Footer
   - Login/register pages
   - Homepage hero section
   - Browser tab (favicon)

### 📞 Support:

If you need help implementing your new logo, just ask!

---
**Current Status:** Waiting for designer's logo files
**System Status:** Using temporary custom logo