import React, { useState, useRef } from 'react';
import { Upload, Loader2, RotateCcw, Microscope, Zap, Target, Lightbulb, FileText } from 'lucide-react';
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
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-emerald-600" />
                </div>
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
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Microscope className="w-5 h-5" />
                      Analyze Disease
                    </span>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isUploading}
                  className="glass-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-5 h-5" />
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
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No results yet</p>
                <p className="text-sm mt-2">Upload and analyze an image to see results</p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                </div>
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
        <div className="glass-card p-6 animate-slide-up hover:shadow-xl transition-shadow">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Detection</h3>
          <p className="text-sm text-gray-600">
            Get instant results powered by advanced AI models trained on thousands of plant images.
          </p>
        </div>
        <div className="glass-card p-6 animate-slide-up hover:shadow-xl transition-shadow" style={{ animationDelay: '0.1s' }}>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">High Accuracy</h3>
          <p className="text-sm text-gray-600">
            MobileNetV2 model with 95%+ accuracy across 13 different plant disease classes.
          </p>
        </div>
        <div className="glass-card p-6 animate-slide-up hover:shadow-xl transition-shadow" style={{ animationDelay: '0.2s' }}>
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
            <Lightbulb className="w-7 h-7 text-purple-600" />
          </div>
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
