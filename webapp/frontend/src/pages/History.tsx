import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, FileText, Clock, Zap, Trash2, Sparkles } from 'lucide-react';
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
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
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
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
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
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
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
                  selectedPrediction?.id === prediction.id ? 'ring-2 ring-emerald-500 shadow-lg' : ''
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
                      <span className="text-2xl font-bold text-emerald-600">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(prediction.created_at)}
                      </span>
                      {prediction.inference_time && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
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
                    <Trash2 className="w-5 h-5 text-red-500" />
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
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
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
                        <span className="font-bold text-emerald-600">
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
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
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
