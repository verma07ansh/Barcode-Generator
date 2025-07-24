import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorProps {
  text: string;
  width?: number;
  height?: number;
  format?: string;
  displayValue?: boolean;
  fontSize?: number;
  textMargin?: number;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  text,
  width = 2,
  height = 30,
  format = 'CODE128',
  displayValue = true,
  fontSize = 20,
  textMargin = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      try {
        JsBarcode(canvasRef.current, text, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          textMargin: textMargin,
          background: '#ffffff',
          lineColor: '#000000',
          margin: 5,
          textAlign: 'center',
          textPosition: 'bottom',
          font: 'monospace',
          fontOptions: '',
          valid: function(valid) {
            if (!valid) {
              console.error('Invalid barcode data');
            }
          }
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [text, width, height, format, displayValue, fontSize, textMargin]);

  if (!text) {
    return (
      <div className="flex items-center justify-center h-16 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-lg">
        <span className="text-gray-500 text-sm font-medium">No barcode data</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto drop-shadow-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default BarcodeGenerator;