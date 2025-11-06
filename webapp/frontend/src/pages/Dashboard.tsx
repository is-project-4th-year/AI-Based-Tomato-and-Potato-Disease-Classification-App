import React, { useState, useRef } from 'react';
import { predictionService } from '../services/api';
import type { Prediction } from '../types';
import PredictionResult from '../components/PredictionResult';

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG or PNG)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setPrediction(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await predictionService.predict(selectedFile);
      setPrediction(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Plant Disease Detection
        </h1>
        <p className="text-lg text-gray-600">
          Upload an image of your plant to detect diseases instantly
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload section */}
        <div className="glass-container animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Image</h2>

          {!previewUrl ? (
            <div
              className={`glass-upload-zone ${isDragging ? 'border-primary-500 bg-primary-50/50' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-primary-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG and PNG (max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image preview */}
              <div className="glass-card p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-xl"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isUploading}
                  className="glass-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    '🔬 Analyze Disease'
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isUploading}
                  className="glass-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-700 text-sm animate-scale-in">
              {error}
            </div>
          )}
        </div>

        {/* Results section */}
        <div className="glass-container animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>

          {!prediction && !isUploading && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <svg className="mx-auto h-20 w-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No results yet</p>
                <p className="text-sm mt-2">Upload and analyze an image to see results</p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Analyzing your plant...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {prediction && <PredictionResult prediction={prediction} />}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="glass-card p-6 animate-slide-up">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Detection</h3>
          <p className="text-sm text-gray-600">
            Get instant results powered by advanced AI models trained on thousands of plant images.
          </p>
        </div>
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">High Accuracy</h3>
          <p className="text-sm text-gray-600">
            MobileNetV2 model with 95%+ accuracy across 13 different plant disease classes.
          </p>
        </div>
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Expert Advice</h3>
          <p className="text-sm text-gray-600">
            Get detailed treatment recommendations and prevention tips for every detected disease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
