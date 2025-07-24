# 📊 Professional Barcode Generator

> A powerful, modern web application for creating and printing professional barcode labels on A4 paper with pixel-perfect precision.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## 🌟 Overview

This Barcode Generator is designed specifically for **library management**, **inventory tracking**, and **organizational labeling**. It provides a seamless experience for creating CODE128 barcodes and QR codes with precise A4 positioning, making it perfect for professional environments that require high-quality, scannable labels. **Generate multiple different barcode types in one session for versatile labeling needs.**

### 🎯 Perfect For
- **Libraries** - Book cataloging and management
- **Warehouses** - Inventory tracking and organization  
- **Retail** - Product labeling and stock management
- **Offices** - Asset tracking and document management
- **Schools** - Equipment and resource labeling

---

## ✨ Key Features

### 🚀 **Advanced Barcode Generation**
- **CODE128 Standard** - Industry-standard format with excellent scanner compatibility
- **Multiple Entries** - Create dozens of different barcodes in a single session
- **Real-time Validation** - Instant feedback on barcode validity and formatting
- **Custom Positioning** - Place barcodes exactly where you need them on the A4 grid

### 🎨 **Professional Interface**
- **Modern Design** - Clean, gradient-based UI with smooth animations and transitions
- **Responsive Layout** - Optimized for desktop, tablet, and large mobile screens
- **Interactive Preview** - Live A4 preview showing exact print layout
- **Smart Grid System** - Visual cell selector with search, multi-select, and conflict prevention

### 📄 **Precision Printing**
- **A4 Optimized** - 65-cell grid (5×13) with 37×20mm cells
- **Exact Measurements** - Millimeter-precise positioning for professional results
- **PDF Export** - High-quality, print-ready PDFs with perfect alignment
- **Multiple Formats** - Support for 40L, 80L, and 65L label standards

### 🔧 **Smart Features**
- **Conflict Prevention** - Automatic detection and prevention of overlapping labels
- **Batch Operations** - Select multiple cells at once for efficiency
- **Search & Filter** - Find specific cell positions quickly
- **Undo/Redo Support** - Easy mistake correction and workflow management

---

## 🛠️ Technology Stack

<table>
<tr>
<td><strong>Frontend Framework</strong></td>
<td>React with TypeScript</td>
</tr>
<tr>
<td><strong>Build Tool</strong></td>
<td>Vite for lightning-fast development</td>
</tr>
<tr>
<td><strong>Styling</strong></td>
<td>Tailwind CSS with PostCSS & Autoprefixer</td>
</tr>
<tr>
<td><strong>Icons</strong></td>
<td>Lucide React for beautiful, consistent icons</td>
</tr>
<tr>
<td><strong>Barcode Engine</strong></td>
<td>JsBarcode for reliable barcode generation</td>
</tr>
<tr>
<td><strong>PDF Generation</strong></td>
<td>jsPDF with html2canvas for perfect exports</td>
</tr>
<tr>
<td><strong>Code Quality</strong></td>
<td>ESLint with TypeScript ESLint for clean code</td>
</tr>
</table>

---


## 📖 User Guide

### 🎯 **Creating Your First Barcode**

1. **Enter Barcode Content**
   - Type your text, numbers, or alphanumeric codes
   - Supports letters, numbers, and special characters
   - Real-time validation ensures barcode compatibility

2. **Select Grid Position**
   - Click on the cell selector dropdown
   - Choose from 65 available positions (numbered 1-65)
   - Use search to find specific cell numbers quickly
   - Select multiple cells for the same barcode if needed

3. **Preview Your Layout**
   - Watch the A4 preview update in real-time
   - See exactly how your labels will appear when printed
   - Verify positioning and spacing before generating PDF

4. **Generate & Print**
   - Click "Download PDF" to create your print file
   - Open the PDF and print on A4 paper
   - Use 100% scale and default margins for best results

### 🔄 **Managing Multiple Barcodes**

- **Add Entries**: Click the "+" button to create additional barcode entries
- **Remove Entries**: Use the trash icon to delete unwanted entries
- **Clear All**: Remove all entries except the first one with "Clear All"
- **Bulk Selection**: Use "Select All" in the cell selector for efficiency

### 🔍 **Advanced Cell Selection**

- **Search**: Type cell numbers to filter the grid
- **Multi-Select**: Hold Ctrl/Cmd while clicking to select multiple cells
- **Range Selection**: Select consecutive cells efficiently
- **Conflict Detection**: Occupied cells are highlighted in red and cannot be selected

---

## 📐 Technical Specifications

### **A4 Layout Details**
```
Paper Size: 210mm × 297mm (A4 Standard)
Grid Layout: 5 columns × 13 rows = 65 cells
Cell Size: 37mm × 20mm each
Column Spacing: 2mm between columns
Row Spacing: 1.7mm between rows (adjustable for rows 5+)
Margins: 8mm left, 9mm top, optimized for printing
```

### **Barcode Specifications**
```
Format: CODE128 (Auto-detection of A, B, C variants)
Width: 1.5 units (optimized for 37mm cells)
Height: 30 units
Font Size: 20px for text display
```

### **Supported Label Formats**
- **40L Format**: 65 cells, 37×20mm dimensions
- **80L Format**: 65 cells, 37×20mm dimensions  
- **65L Format**: 65 cells, 37×20mm dimensions

---

## 🏗️ Project Architecture

```
src/
├── components/
│   ├── A4Preview.tsx          # Real-time A4 paper preview
│   ├── BarcodeGenerator.tsx   # Individual barcode rendering
│   └── CellSelector.tsx       # Interactive grid cell selection
├── utils/
│   └── pdfGenerator.ts        # PDF creation and export logic
├── App.tsx                    # Main application component
├── main.tsx                   # React application entry point
├── index.css                  # Global styles and Tailwind imports
└── vite-env.d.ts             # Vite environment type definitions

Configuration Files:
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS customization
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint rules and settings
└── postcss.config.js         # PostCSS plugins
```

---

## 🖨️ Printing Guide

### **Recommended Printer Settings**
```
Paper Size: A4 (210 × 297 mm)
Orientation: Portrait
Scale: 100% (Actual Size)
Margins: Fit to paper
Quality: High/Best (600 DPI minimum)
Color: Black & White (recommended for barcodes)
```


### **Troubleshooting Print Issues**
- **Misaligned labels**: Check printer margins and paper guides
- **Blurry barcodes**: Increase print quality settings
- **Cut-off content**: Verify 100% scale and A4 paper size
- **Spacing issues**: Ensure no custom margins are applied

---

## 🔧 Development

### **Available Scripts**
```bash
npm run dev      # Start development server with hot reload
npm run build    # Create production build
npm run preview  # Preview production build locally
```

### **Development Guidelines**
- **TypeScript First**: All components use TypeScript for type safety
- **Functional Components**: Modern React with hooks pattern
- **Tailwind CSS**: Utility-first styling approach
- **Component Isolation**: Each component handles its own state and logic
- **Performance Optimized**: Efficient re-renders and memory usage

### **Code Style Standards**
- **ESLint Configuration**: Enforces consistent code formatting
- **TypeScript Strict Mode**: Maximum type safety and error prevention
- **React Best Practices**: Hooks, functional components, and proper state management
- **Accessibility**: ARIA labels and keyboard navigation support

---


## 🐛 Troubleshooting

### **Common Issues & Solutions**

<details>
<summary><strong>🔴 Barcodes Not Generating</strong></summary>

**Symptoms**: Empty cells or error messages in preview
**Solutions**:
- Ensure barcode text is not empty
- Check that cell positions are selected
- Verify text contains valid characters for CODE128
- Try refreshing the page and re-entering data
</details>

<details>
<summary><strong>🔴 PDF Download Not Working</strong></summary>

**Symptoms**: No download prompt or corrupted PDF
**Solutions**:
- Check browser popup/download settings
- Ensure sufficient memory for large layouts
- Try a different browser or incognito mode
- Clear browser cache and cookies
</details>

<details>
<summary><strong>🔴 Print Layout Incorrect</strong></summary>

**Symptoms**: Misaligned or cut-off labels when printed
**Solutions**:
- Verify A4 paper size in print dialog
- Set browser zoom to 100%
- Use default or minimum margins
- Check printer calibration and paper guides
</details>

<details>
<summary><strong>🔴 Performance Issues</strong></summary>

**Symptoms**: Slow rendering or browser freezing
**Solutions**:
- Limit simultaneous barcode entries (recommended: <50)
- Use shorter text strings when possible
- Close other browser tabs to free memory
- Try refreshing the page to reset state
</details>

### **Getting Help**
- 📧 Create an issue in the repository with detailed error information
- 📖 Check this README for common solutions
- 🔍 Search existing issues for similar problems
- 💬 Include browser version, OS, and steps to reproduce

---


<div align="center">

**🏷️ Built with ❤️ for efficient barcode label management**

*Perfect for libraries, warehouses, retail, and any organization that needs professional barcode labels*

⭐ Star this repo • 🐛 Report Bug 

</div>
