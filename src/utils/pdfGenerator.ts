import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import { BarcodeEntry } from '../App';

export const generatePDF = async (element: HTMLElement, barcodeEntries: BarcodeEntry[], filename: string = 'barcode-labels') => {
  try {
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate positioning based on cell position
    const columns = 5;
    
    // Cell dimensions and spacing (exact measurements)
    const cellWidth = 37; // mm
    const cellHeight = 20; // mm
    const columnSpacing = 2; // mm
    const rowSpacing = 1.7; // mm - for first 4 rows
    const adjustedRowSpacing = 1.5; // mm - for rows 5+
    const topMargin = 9; // mm - reduced by 2mm to shift top 4 rows upward
    
    // Calculate left margin to center the grid
    const totalGridWidth = columns * cellWidth + (columns - 1) * columnSpacing;
    const leftMargin = 8; // mm - reduced to shift grid left and prevent right-side cutting
    
    // Generate barcode for each entry and its cell positions
    for (const entry of barcodeEntries) {
      for (const cellPosition of entry.cellPositions) {
        // Create a temporary canvas for each barcode
        const canvas = document.createElement('canvas');
        
        // Generate barcode directly on canvas
        JsBarcode(canvas, entry.text, {
          format: 'CODE128',
          width: 1.5,
          height: 30,
          displayValue: true,
          fontSize: 20,
          textMargin: 2,
          background: '#ffffff',
          lineColor: '#000000',
          margin: 5,
          textAlign: 'center',
          textPosition: 'bottom',
          font: 'monospace',
        });

        // Calculate cell position
        const cellIndex = cellPosition - 1;
        const col = cellIndex % columns;
        const row = Math.floor(cellIndex / columns);
        
        const x = leftMargin + col * (cellWidth + columnSpacing);
        
        // Calculate Y position
        let y = topMargin;
        for (let r = 0; r < row; r++) {
          // Use different spacing: 2mm for first row, 1.7mm for rows 2-4, 1.5mm for rows 5+
          let spacing;
          if (r === 0) {
            spacing = 2; // 2mm spacing after first row
          } else if (r >= 3) {
            spacing = adjustedRowSpacing; // 1.5mm for rows 5+
          } else {
            spacing = rowSpacing; // 1.7mm for rows 2-4
          }
          y += cellHeight + spacing;
        }

        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate image dimensions to fit in cell with some padding
        const padding = 2; // mm padding
        const maxWidth = cellWidth - (padding * 2);
        const maxHeight = cellHeight - (padding * 2);
        
        // Calculate actual image dimensions maintaining aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        let imgWidth = maxWidth;
        let imgHeight = imgWidth / canvasAspectRatio;
        
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * canvasAspectRatio;
        }
        
        // Center the image in the cell
        const imgX = x + (cellWidth - imgWidth) / 2;
        const imgY = y + (cellHeight - imgHeight) / 2;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
      }
    }
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};