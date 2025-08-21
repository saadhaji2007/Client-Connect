// components/MLInsights.js
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import mlService from "../utils/mlPredictionsservice"

export default function MLInsights({ clients }) {
  const [projectPredictions, setProjectPredictions] = useState([]);
  const [revenueForecast, setRevenueForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clients && clients.length > 0) {
      generatePredictions();
    }
  }, [clients]);

  const generatePredictions = async () => {
    setIsLoading(true);
    
    try {
      // Generate project success predictions for active projects
      const activeProjects = clients.filter(client => 
        client.project && client.status === 'Active'
      );

      const predictions = await Promise.all(
        activeProjects.map(async (client) => {
          const prediction = await mlService.predictProjectSuccess(client.project);
          return {
            clientId: client.id,
            clientName: client.name,
            projectTitle: client.project.title,
            ...prediction
          };
        })
      );

      setProjectPredictions(predictions);

      // Generate revenue forecast
      const forecast = await mlService.predictRevenue(clients, 'monthly');
      setRevenueForecast(forecast);

    } catch (error) {
      console.error('Error generating ML predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <Brain className="animate-spin mr-2" size={24} />
          <span>Analyzing data with AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Forecast */}
      {revenueForecast && (
        <RevenueForecastCard forecast={revenueForecast} />
      )}

      {/* Project Success Predictions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Brain className="mr-2 text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Project Success Predictions</h2>
        </div>

        {projectPredictions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No active projects to analyze</p>
            <p className="text-sm">Add projects to clients to see AI predictions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projectPredictions.map((prediction, index) => (
              <ProjectPredictionCard key={index} prediction={prediction} />
            ))}
          </div>
        )}
      </div>

      {/* Overall Insights */}
      <OverallInsights predictions={projectPredictions} forecast={revenueForecast} />
    </div>
  );
}

// Revenue Forecast Component
function RevenueForecastCard({ forecast }) {
  const getTrendIcon = () => {
    switch (forecast.trend) {
      case 'increasing': return <TrendingUp className="text-green-500" size={20} />;
      case 'decreasing': return <TrendingUp className="text-red-500 transform rotate-180" size={20} />;
      default: return <TrendingUp className="text-yellow-500" size={20} />;
    }
  };

  const getTrendColor = () => {
    switch (forecast.trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <DollarSign className="mr-2" size={24} />
          <h2 className="text-xl font-bold">Revenue Forecast</h2>
        </div>
        <div className="flex items-center">
          {getTrendIcon()}
          <span className="ml-1 text-sm capitalize">{forecast.trend}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm opacity-80">Predicted Revenue</p>
          <p className="text-2xl font-bold">₹{forecast.predictedRevenue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm opacity-80">Range</p>
          <p className="text-lg">₹{forecast.lowerBound.toLocaleString()} - ₹{forecast.upperBound.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm opacity-80">Confidence</p>
          <p className="text-lg capitalize">{forecast.confidence}</p>
        </div>
      </div>

      <div className="mt-4 bg-white/20 rounded-lg p-3">
        <p className="text-sm">
          <Calendar className="inline mr-1" size={14} />
          Next {forecast.timeframe} projection based on current client data
        </p>
      </div>
    </div>
  );
}

// Project Prediction Component
function ProjectPredictionCard({ prediction }) {
  const getSuccessColor = (probability) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessIcon = (probability) => {
    if (probability >= 80) return <CheckCircle className="text-green-500" size={20} />;
    if (probability >= 60) return <AlertTriangle className="text-yellow-500" size={20} />;
    return <AlertTriangle className="text-red-500" size={20} />;
  };

  const getProgressBarColor = (probability) => {
    if (probability >= 80) return 'bg-green-500';
    if (probability >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{prediction.clientName}</h3>
          <p className="text-sm text-gray-600">{prediction.projectTitle}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center">
            {getSuccessIcon(prediction.successProbability)}
            <span className={`ml-2 text-2xl font-bold ${getSuccessColor(prediction.successProbability)}`}>
              {prediction.successProbability}%
            </span>
          </div>
          <p className="text-xs text-gray-500 capitalize">{prediction.confidence} confidence</p>
        </div>
      </div>

      {/* Success Probability Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Success Probability</span>
          <span>{prediction.successProbability}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(prediction.successProbability)}`}
            style={{ width: `${prediction.successProbability}%` }}
          />
        </div>
      </div>

      {/* Risk Factors */}
      {prediction.riskFactors && prediction.riskFactors.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Risk Factors:</p>
          <div className="flex flex-wrap gap-1">
            {prediction.riskFactors.map((risk, index) => (
              <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                {risk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {prediction.recommendations && prediction.recommendations.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Recommendations:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {prediction.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Overall Insights Component
function OverallInsights({ predictions, forecast }) {
  const highRiskProjects = predictions.filter(p => p.successProbability < 60).length;
  const successfulProjects = predictions.filter(p => p.successProbability >= 80).length;
  const totalPredictions = predictions.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">AI Insights Summary</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{successfulProjects}</div>
          <div className="text-sm text-green-700">High Success Rate Projects</div>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{highRiskProjects}</div>
          <div className="text-sm text-red-700">High Risk Projects</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {totalPredictions > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.successProbability, 0) / totalPredictions) : 0}%
          </div>
          <div className="text-sm text-blue-700">Average Success Rate</div>
        </div>
      </div>

      {forecast && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Business Insights</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Revenue trend is <span className="font-semibold">{forecast.trend}</span></li>
            <li>• Expected monthly revenue: ₹{forecast.predictedRevenue.toLocaleString()}</li>
            {highRiskProjects > 0 && (
              <li>• {highRiskProjects} project{highRiskProjects > 1 ? 's' : ''} need immediate attention</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}