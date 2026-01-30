'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Palette, Building2, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const DEFAULT_COLORS = [
  { name: 'Navy', primary: '#003B75', secondary: '#00A3E0', accent: '#FF6B35' },
  { name: 'Forest', primary: '#1B4332', secondary: '#40916C', accent: '#F4A261' },
  { name: 'Burgundy', primary: '#6B2737', secondary: '#C44569', accent: '#F8B500' },
  { name: 'Slate', primary: '#2C3E50', secondary: '#3498DB', accent: '#E74C3C' },
];

export function BrandingPanel() {
  const { brand, setBrand } = useAppStore();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setBrand({ logo: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    },
    [setBrand]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const applyPreset = (preset: typeof DEFAULT_COLORS[0]) => {
    setBrand({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    });
    setSelectedPreset(preset.name);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          Branding
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload your logo and choose colors
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1.5" />
            Company Name
          </label>
          <input
            type="text"
            value={brand.companyName}
            onChange={(e) => setBrand({ companyName: e.target.value })}
            placeholder="Your Company Name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Upload className="w-4 h-4 inline mr-1.5" />
            Logo
          </label>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            )}
          >
            <input {...getInputProps()} />
            {brand.logo ? (
              <div className="space-y-2">
                <img
                  src={brand.logo}
                  alt="Logo preview"
                  className="max-h-16 mx-auto object-contain"
                />
                <p className="text-xs text-slate-500">
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="py-4">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">
                  Drag & drop your logo here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG, or SVG (max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Color Themes
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_COLORS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all text-left',
                  selectedPreset === preset.name
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div className="flex gap-1 mb-1.5">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  {preset.name}
                  {selectedPreset === preset.name && (
                    <Check className="w-3 h-3 text-indigo-600" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Custom Colors
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brand.primaryColor}
                onChange={(e) => {
                  setBrand({ primaryColor: e.target.value });
                  setSelectedPreset(null);
                }}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
              />
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-600">Primary</span>
                <input
                  type="text"
                  value={brand.primaryColor}
                  onChange={(e) => setBrand({ primaryColor: e.target.value })}
                  className="w-full text-xs px-2 py-1 border border-slate-200 rounded mt-0.5"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brand.secondaryColor}
                onChange={(e) => {
                  setBrand({ secondaryColor: e.target.value });
                  setSelectedPreset(null);
                }}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
              />
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-600">Secondary</span>
                <input
                  type="text"
                  value={brand.secondaryColor}
                  onChange={(e) => setBrand({ secondaryColor: e.target.value })}
                  className="w-full text-xs px-2 py-1 border border-slate-200 rounded mt-0.5"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brand.accentColor}
                onChange={(e) => {
                  setBrand({ accentColor: e.target.value });
                  setSelectedPreset(null);
                }}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
              />
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-600">Accent</span>
                <input
                  type="text"
                  value={brand.accentColor}
                  onChange={(e) => setBrand({ accentColor: e.target.value })}
                  className="w-full text-xs px-2 py-1 border border-slate-200 rounded mt-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preview
          </label>
          <div
            className="rounded-lg p-4 transition-colors"
            style={{ backgroundColor: brand.primaryColor }}
          >
            <div className="flex items-center justify-between mb-3">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt="Logo"
                  className="h-6 object-contain filter brightness-0 invert"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {brand.companyName || 'Your Company'}
                </span>
              )}
            </div>
            <div
              className="h-1 rounded mb-2"
              style={{ backgroundColor: brand.secondaryColor }}
            />
            <div className="flex gap-2">
              <div
                className="px-3 py-1.5 rounded text-xs text-white font-medium"
                style={{ backgroundColor: brand.secondaryColor }}
              >
                Primary Button
              </div>
              <div
                className="px-3 py-1.5 rounded text-xs text-white font-medium"
                style={{ backgroundColor: brand.accentColor }}
              >
                Accent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
