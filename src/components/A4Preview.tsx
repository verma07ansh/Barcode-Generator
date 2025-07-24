import React, { forwardRef } from 'react';
import BarcodeGenerator from './BarcodeGenerator';
import { BarcodeEntry } from '../App';

interface A4PreviewProps {
  barcodeEntries: BarcodeEntry[];
  layoutType: string;
}

const A4Preview = forwardRef<HTMLDivElement, A4PreviewProps>(
  ({ barcodeEntries, layoutType }, ref) => {
    // A4 dimensions in mm: 210 x 297
    // Cell dimensions: 37 x 20 mm
    // Top margin: 11mm, Bottom margin: 13mm
    // Column spacing: 2mm between columns
    // Row spacing: 1.7mm between rows
    // Cells in columns are connected (no vertical gaps)
    const columns = 5;
    const rows = 13;
    const totalCells = columns * rows; // 65 cells
    
    // Scale factor for preview (to fit on screen)
    const scaleFactor = 0.8;
    
    // Cell dimensions in pixels (37mm x 20mm)
    const cellWidth = 37 * 3.78 * scaleFactor;
    const cellHeight = 20 * 3.78 * scaleFactor;
    
    // Spacing between columns (2mm)
    const columnSpacing = 2 * 3.78 * scaleFactor;
    
    // Spacing between rows - adjusted for better alignment
    const rowSpacing = 1.7 * 3.78 * scaleFactor;
    const adjustedRowSpacing = 1.5 * 3.78 * scaleFactor; // For rows 5+
    const firstRowSpacing = 2 * 3.78 * scaleFactor; // 2mm for first row
    
    // Top margin (11mm)
    const topMargin = 9 * 3.78 * scaleFactor; // Reduced by 2mm
    // Bottom margin (13mm)
    const bottomMargin = 13 * 3.78 * scaleFactor;
    
    // A4 dimensions in pixels
    const a4Width = 210 * 3.78 * scaleFactor; // 210mm to pixels
    const a4Height = 297 * 3.78 * scaleFactor; // 297mm to pixels
    
    // Left margin adjustment (5mm shift towards center)
    const leftMargin = 8 * 3.78 * scaleFactor; // Reduced to shift grid left
    
    // Create a map of cell positions to barcode data for quick lookup
    const cellToBarcodeMap = new Map<number, BarcodeEntry>();
    barcodeEntries.forEach(entry => {
      entry.cellPositions.forEach(cellPos => {
        cellToBarcodeMap.set(cellPos, entry);
      });
    });
    
    const renderCell = (cellNumber: number, columnIndex: number, rowIndex: number) => {
      const barcodeEntry = cellToBarcodeMap.get(cellNumber);
      const hasBarcode = !!barcodeEntry;
      
      return (
        <div
          key={cellNumber}
          data-cell-number={cellNumber}
          className={`border border-gray-300 flex items-center justify-center relative transition-all duration-300 ${
            hasBarcode 
              ? 'bg-white shadow-lg ring-2 ring-blue-500 ring-opacity-50' 
              : 'bg-gray-50/80 hover:bg-gray-100/80'
          }`}
          style={{
            width: `${cellWidth}px`,
            height: `${cellHeight}px`,
            minWidth: `${cellWidth}px`,
            minHeight: `${cellHeight}px`,
            marginRight: columnIndex < columns - 1 ? `${columnSpacing}px` : '0px',
          }}
        >
          {hasBarcode ? (
            <div className="w-full h-full flex items-center justify-center p-1 barcode-content">
              <BarcodeGenerator
                text={barcodeEntry.text}
                width={1.2}
                height={20}
                fontSize={18}
                textMargin={2}
              />
            </div>
          ) : (
            <span className="text-xs text-gray-400 font-mono select-none">
              {cellNumber}
            </span>
          )}
          
          {/* Highlight effect for selected cell */}
          {hasBarcode && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-5 rounded-sm pointer-events-none"></div>
          )}
        </div>
      );
    };

    // Create grid with proper column spacing
    const renderGrid = () => {
      const grid = [];
      let cellNumber = 1;
      
      for (let row = 0; row < rows; row++) {
        const rowCells = [];
        for (let col = 0; col < columns; col++) {
          rowCells.push(renderCell(cellNumber, col, row));
          cellNumber++;
        }
        
        grid.push(
          <div key={row} className="flex" style={{ 
            marginBottom: row < rows - 1 ? (
              row === 0 ? `${firstRowSpacing}px` : 
              row >= 3 ? `${adjustedRowSpacing}px` : 
              `${rowSpacing}px`
            ) : '0px' 
          }}>
            {rowCells}
          </div>
        );
      }
      return grid;
    };

    return (
      <div className="flex items-center justify-center">
        <div
          ref={ref}
          className="bg-white shadow-2xl border border-gray-300 relative overflow-hidden rounded-lg"
          style={{
            width: `${a4Width}px`,
            height: `${a4Height}px`,
            minWidth: `${a4Width}px`,
            minHeight: `${a4Height}px`,
          }}
        >
          {/* A4 Paper indicator */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
            <span className="text-xs text-gray-600 font-medium">A4 - {layoutType}</span>
          </div>
          
          {/* Corner indicators */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-gray-300 rounded-tl-sm"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-gray-300 rounded-tr-sm"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-gray-300 rounded-bl-sm"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-gray-300 rounded-br-sm"></div>
          
          {/* Grid container with exact margins */}
          <div 
            className="flex flex-col grid-container"
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: `${topMargin}px`,
              paddingBottom: `${bottomMargin}px`,
              paddingLeft: `${leftMargin}px`,
              height: '100%',
            }}
          >
            {renderGrid()}
          </div>
        </div>
      </div>
    );
  }
);

A4Preview.displayName = 'A4Preview';

export default A4Preview;