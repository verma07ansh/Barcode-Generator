import React, { useState, useRef } from 'react';
import { Download, Grid, Type, Layout, Zap, FileText, Plus, Trash2 } from 'lucide-react';
import BarcodeGenerator from './components/BarcodeGenerator';
import A4Preview from './components/A4Preview';
import CellSelector from './components/CellSelector';
import { generatePDF } from './utils/pdfGenerator';

export interface BarcodeEntry {
  id: string;
  text: string;
  cellPositions: number[];
}

function App() {
  const [barcodeEntries, setBarcodeEntries] = useState<BarcodeEntry[]>([
    { id: '1', text: '', cellPositions: [1] }
  ]);
  const [selectedLayout, setSelectedLayout] = useState('40L');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const layoutOptions = [
    { value: '40L', label: '40L - 65 cells on A4 (37 x 20 mm)', cells: 65 },
    { value: '80L', label: '80L - 65 cells on A4 (37 x 20 mm)', cells: 65 },
    { value: '65L', label: '65L - 65 cells on A4 (37 x 20 mm)', cells: 65 },
  ];

  const currentLayout = layoutOptions.find(layout => layout.value === selectedLayout) || layoutOptions[0];

  // Get all occupied cells to prevent conflicts
  const getOccupiedCells = (excludeId?: string) => {
    return barcodeEntries
      .filter(entry => entry.id !== excludeId)
      .flatMap(entry => entry.cellPositions);
  };

  const addBarcodeEntry = () => {
    const newId = Date.now().toString();
    setBarcodeEntries([...barcodeEntries, {
      id: newId,
      text: '',
      cellPositions: []
    }]);
  };

  const removeBarcodeEntry = (id: string) => {
    if (barcodeEntries.length > 1) {
      setBarcodeEntries(barcodeEntries.filter(entry => entry.id !== id));
    }
  };

  const updateBarcodeEntry = (id: string, updates: Partial<BarcodeEntry>) => {
    setBarcodeEntries(barcodeEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    const validEntries = barcodeEntries.filter(entry => 
      entry.text.trim() && entry.cellPositions.length > 0
    );

    if (validEntries.length === 0) return;

    setIsGenerating(true);
    try {
      await generatePDF(previewRef.current, validEntries, 'barcode-labels');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasValidEntries = barcodeEntries.some(entry => 
    entry.text.trim() && entry.cellPositions.length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
                <Grid className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Barcode Generator
                </h1>
                <p className="text-xs text-gray-600">Create professional barcode labels for A4 printing</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
              <FileText className="h-3 w-3" />
              <span>A4</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Type className="h-5 w-5 mr-2" />
                  Configuration
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Layout Selection */}
                <div className="space-y-3">
                  <label htmlFor="layout-select" className="block text-sm font-semibold text-gray-700">
                    Label Format
                  </label>
                  <select
                    id="layout-select"
                    value={selectedLayout}
                    onChange={(e) => setSelectedLayout(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  >
                    {layoutOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Barcode Entries */}
                <div className="space-y-4">
                  {/* Sticky Header with Controls */}
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-3 -m-3 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Barcode Entries ({barcodeEntries.length})
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={addBarcodeEntry}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                        {barcodeEntries.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm('Remove all entries except the first one?')) {
                                setBarcodeEntries([barcodeEntries[0]]);
                              }
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Clear All</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Valid: {barcodeEntries.filter(entry => entry.text.trim() && entry.cellPositions.length > 0).length}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Cells Used: {barcodeEntries.reduce((acc, entry) => acc + entry.cellPositions.length, 0)}/65</span>
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Entries Container */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {barcodeEntries.map((entry, index) => (
                      <div key={entry.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 space-y-3 border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              entry.text.trim() && entry.cellPositions.length > 0 
                                ? 'bg-green-500' 
                                : 'bg-gray-400'
                            }`}></div>
                            <span className="text-sm font-semibold text-gray-700">
                              Entry #{index + 1}
                            </span>
                            {entry.cellPositions.length > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {entry.cellPositions.length} cell{entry.cellPositions.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={addBarcodeEntry}
                              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200"
                              title="Add new entry"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            {barcodeEntries.length > 1 && (
                              <button
                                onClick={() => removeBarcodeEntry(entry.id)}
                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200"
                                title="Remove this entry"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Text Input */}
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600">
                            Barcode Content
                          </label>
                          <input
                            type="text"
                            value={entry.text}
                            onChange={(e) => updateBarcodeEntry(entry.id, { text: e.target.value })}
                            placeholder="Enter text or numbers..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>

                        {/* Cell Selection */}
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600">
                            Target Positions ({entry.cellPositions.length} selected)
                          </label>
                          <CellSelector
                            selectedCells={entry.cellPositions}
                            onCellSelect={(cells) => updateBarcodeEntry(entry.id, { cellPositions: cells })}
                            totalCells={currentLayout.cells}
                            occupiedCells={getOccupiedCells(entry.id)}
                          />
                        </div>

                        {/* Preview */}
                        {entry.text && (
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs text-gray-500 mb-2">Preview:</div>
                            <BarcodeGenerator
                              text={entry.text}
                              width={1.2}
                              height={20}
                              fontSize={16}
                              textMargin={1}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-4">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!hasValidEntries || isGenerating}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
                  </button>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Grid className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Label Specifications</h4>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        <li>• Cell size: 37mm × 20mm</li>
                        <li>• Grid: 5 columns × 13 rows</li>
                        <li>• A4 compatible format</li>
                        <li>• Multiple barcodes supported</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Layout className="h-5 w-5 mr-2" />
                  A4 Preview
                </h2>
              </div>

              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl shadow-inner">
                  <A4Preview
                    ref={previewRef}
                    barcodeEntries={barcodeEntries.filter(entry => entry.text.trim() && entry.cellPositions.length > 0)}
                    layoutType={selectedLayout}
                  />
                </div>
                
                {/* Preview Info */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Live Preview</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Scale: 80%</span>
                    <span>Format: A4</span>
                    <span>Entries: {barcodeEntries.filter(entry => entry.text.trim() && entry.cellPositions.length > 0).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;