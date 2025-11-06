import React, { useEffect, useState } from 'react';
import { predictionService, handleApiError } from '../services/api';
import type { Prediction } from '../types';

const History: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setIsLoading(true);
      const response = await predictionService.getPredictions();
      setPredictions(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      await predictionService.deletePrediction(id);
      setPredictions(predictions.filter((p) => p.id !== id));
      if (selectedPrediction?.id === id) {
        setSelectedPrediction(null);
      }
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const formatClassName = (className: string) => {
    return className.replace(/_/g, ' ').replace(/___/g, ' - ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getImageUrl = (path: string) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading your history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button onClick={loadPredictions} className="glass-button-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Prediction History</h1>
        <p className="text-lg text-gray-600">
          View and manage your past plant disease analyses
        </p>
      </div>

      {predictions.length === 0 ? (
        <div className="glass-container text-center py-16">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No predictions yet</h2>
          <p className="text-gray-600 mb-6">Start by analyzing your first plant image</p>
          <a href="/dashboard" className="glass-button-primary inline-block">
            Go to Dashboard
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Predictions list */}
          <div className="lg:col-span-2 space-y-4">
            {predictions.map((prediction) => (
              <div
                key={prediction.id}
                className={`glass-card p-6 cursor-pointer transition-all hover:shadow-2xl ${
                  selectedPrediction?.id === prediction.id ? 'ring-2 ring-primary-500 glow-green' : ''
                }`}
                onClick={() => setSelectedPrediction(prediction)}
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(prediction.image_path)}
                      alt="Plant"
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 truncate">
                          {formatClassName(prediction.predicted_class)}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {prediction.plant_type} Plant
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-primary-600">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(prediction.created_at)}
                      </span>
                      {prediction.inference_time && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {prediction.inference_time.toFixed(2)}s
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(prediction.id);
                    }}
                    className="flex-shrink-0 p-2 hover:bg-red-100/80 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            <div className="glass-container sticky top-24">
              {!selectedPrediction ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <p className="text-gray-500">
                    Select a prediction to view details
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={getImageUrl(selectedPrediction.image_path)}
                    alt="Plant"
                    className="w-full h-48 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {formatClassName(selectedPrediction.predicted_class)}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-bold text-primary-600">
                          {(selectedPrediction.confidence * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plant Type:</span>
                        <span className="font-medium capitalize">{selectedPrediction.plant_type}</span>
                      </div>
                      {selectedPrediction.inference_time && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Analysis Time:</span>
                          <span className="font-medium">{selectedPrediction.inference_time.toFixed(2)}s</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedPrediction.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedPrediction.disease && (
                    <div className="pt-4 border-t border-white/50">
                      <h4 className="font-bold text-gray-800 mb-2">Disease Information</h4>
                      {selectedPrediction.disease.description && (
                        <p className="text-sm text-gray-700 mb-3">{selectedPrediction.disease.description}</p>
                      )}
                      {selectedPrediction.disease.severity && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                          {selectedPrediction.disease.severity.toUpperCase()} Severity
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
