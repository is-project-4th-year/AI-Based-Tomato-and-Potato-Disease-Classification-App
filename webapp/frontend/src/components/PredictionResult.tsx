import React from 'react';
import { CheckCircle, AlertCircle, FileText, Eye, Pill, Shield, AlertTriangle, PartyPopper } from 'lucide-react';
import type { Prediction } from '../types';

interface PredictionResultProps {
  prediction: Prediction;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction }) => {
  const confidencePercentage = (prediction.confidence * 100).toFixed(2);
  const isHealthy = prediction.predicted_class.toLowerCase().includes('healthy');

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-100/80';
      case 'medium':
        return 'text-orange-600 bg-orange-100/80';
      case 'high':
      case 'critical':
        return 'text-red-600 bg-red-100/80';
      default:
        return 'text-gray-600 bg-gray-100/80';
    }
  };

  const formatClassName = (className: string) => {
    return className.replace(/_/g, ' ').replace(/___/g, ' - ');
  };

  return (
    <div className="space-y-6 animate-scale-in">
      {/* Main prediction */}
      <div className={`glass-result-card ${isHealthy ? 'shadow-lg' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isHealthy
                  ? 'bg-gradient-to-br from-emerald-100 to-green-100'
                  : 'bg-gradient-to-br from-red-100 to-orange-100'
              }`}>
                {isHealthy ? (
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {formatClassName(prediction.predicted_class)}
                </h3>
                <p className="text-sm text-gray-500 capitalize">
                  {prediction.plant_type} Plant
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">
              {confidencePercentage}%
            </div>
            <p className="text-xs text-gray-500">Confidence</p>
          </div>
        </div>

        {/* Severity badge */}
        {prediction.disease && (
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(prediction.disease.severity)}`}>
              {prediction.disease.severity?.toUpperCase()} Severity
            </span>
            {prediction.inference_time && (
              <span className="px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100/80">
                {prediction.inference_time.toFixed(2)}s analysis time
              </span>
            )}
          </div>
        )}

        {/* Disease information */}
        {prediction.disease && (
          <div className="space-y-4 pt-4 border-t border-white/50">
            {prediction.disease.description && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Description
                </h4>
                <p className="text-sm text-gray-700">{prediction.disease.description}</p>
              </div>
            )}

            {prediction.disease.symptoms && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Symptoms
                </h4>
                <p className="text-sm text-gray-700">{prediction.disease.symptoms}</p>
              </div>
            )}

            {prediction.disease.treatment && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-600" />
                  Treatment
                </h4>
                <p className="text-sm text-gray-700">{prediction.disease.treatment}</p>
              </div>
            )}

            {prediction.disease.prevention && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Prevention
                </h4>
                <p className="text-sm text-gray-700">{prediction.disease.prevention}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alternative predictions */}
      {prediction.all_predictions && prediction.all_predictions.length > 1 && (
        <div className="glass-card p-6">
          <h4 className="font-bold text-gray-800 mb-4">Alternative Predictions</h4>
          <div className="space-y-3">
            {prediction.all_predictions.slice(1, 4).map((pred, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
              >
                <span className="text-sm text-gray-700">
                  {formatClassName(pred.class_name)}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${pred.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-14 text-right">
                    {(pred.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action tips */}
      {!isHealthy && (
        <div className="glass-card p-6 bg-gradient-to-br from-amber-50/70 to-orange-50/70">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Recommended Actions
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
              <span>Isolate affected plants to prevent disease spread</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
              <span>Follow the treatment recommendations above</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
              <span>Monitor plant health daily and recheck in 7-10 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
              <span>Consult a local agricultural expert for severe cases</span>
            </li>
          </ul>
        </div>
      )}

      {isHealthy && (
        <div className="glass-card p-6 bg-gradient-to-br from-green-50/70 to-emerald-50/70">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-emerald-600" />
            Great News!
          </h4>
          <p className="text-sm text-gray-700">
            Your plant appears to be healthy! Continue with regular care and monitoring to maintain its health.
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
