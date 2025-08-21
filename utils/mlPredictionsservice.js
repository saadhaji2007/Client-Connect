// utils/mlPredictionService.js 
import * as tf from '@tensorflow/tfjs';

class MLPredictionService {
  constructor() {
    this.projectSuccessModel = null;
    this.revenueModel = null;
    this.isInitialized = false;
    this.isTraining = false; // Prevent multiple training sessions
    this.trainingPromise = null; // Store training promise
  }

  // Initialize TensorFlow.js models
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await tf.ready();
      this.createProjectSuccessModel();
      this.createRevenueModel();
      this.isInitialized = true;
      console.log('ML Models initialized successfully');
    } catch (error) {
      console.error('Error initializing ML models:', error);
    }
  }

  // Create a simple neural network for project success prediction
  createProjectSuccessModel() {
    this.projectSuccessModel = tf.sequential({
      layers: [
        tf.layers.dense({ 
          inputShape: [6],
          units: 16, 
          activation: 'relu' 
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.projectSuccessModel.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
  }

  // Create a model for revenue forecasting
  createRevenueModel() {
    this.revenueModel = tf.sequential({
      layers: [
        tf.layers.dense({ 
          inputShape: [4],
          units: 12, 
          activation: 'relu' 
        }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    this.revenueModel.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
  }

  // Train models only once - prevent multiple training
  async ensureModelsAreTrained() {
    if (this.isTraining) {
      // If already training, wait for it to complete
      return this.trainingPromise;
    }

    if (this.projectSuccessModel && this.revenueModel && !this.isTraining) {
      this.isTraining = true;
      
      this.trainingPromise = this.performTraining();
      await this.trainingPromise;
      
      this.isTraining = false;
    }
  }

  async performTraining() {
    try {
      // Train project success model
      const projectData = this.generateSampleProjectData();
      const projectXs = tf.tensor2d(projectData.features);
      const projectYs = tf.tensor2d(projectData.labels);

      await this.projectSuccessModel.fit(projectXs, projectYs, {
        epochs: 30, // Reduced epochs for faster training
        batchSize: 16,
        validationSplit: 0.2,
        verbose: 0
      });

      projectXs.dispose();
      projectYs.dispose();

      // Train revenue model
      const revenueData = this.generateSampleRevenueData();
      const revenueXs = tf.tensor2d(revenueData.features);
      const revenueYs = tf.tensor2d(revenueData.labels);

      await this.revenueModel.fit(revenueXs, revenueYs, {
        epochs: 50, // Reduced epochs for faster training
        batchSize: 8,
        validationSplit: 0.2,
        verbose: 0
      });

      revenueXs.dispose();
      revenueYs.dispose();

      console.log('ML Models trained successfully');
    } catch (error) {
      console.error('Error training ML models:', error);
    }
  }

  // Predict project success probability
  async predictProjectSuccess(projectData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Ensure models are trained before prediction
    await this.ensureModelsAreTrained();

    try {
      const features = this.extractProjectFeatures(projectData);
      const input = tf.tensor2d([features]);
      const prediction = this.projectSuccessModel.predict(input);
      const probability = await prediction.data();
      
      input.dispose();
      prediction.dispose();
      
      return {
        successProbability: Math.round(probability[0] * 100),
        confidence: this.calculateConfidence(probability[0]),
        riskFactors: this.identifyRiskFactors(projectData),
        recommendations: this.generateRecommendations(projectData, probability[0])
      };
    } catch (error) {
      console.error('Error predicting project success:', error);
      // Return safe default values
      return { 
        successProbability: 75, 
        confidence: 'medium', 
        riskFactors: [], 
        recommendations: ['Monitor project progress regularly'] 
      };
    }
  }

  // Predict future revenue
  async predictRevenue(clientsData, timeframe = 'monthly') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Ensure models are trained before prediction
    await this.ensureModelsAreTrained();

    try {
      const features = this.extractRevenueFeatures(clientsData);
      const input = tf.tensor2d([features]);
      const prediction = this.revenueModel.predict(input);
      const revenue = await prediction.data();
      
      input.dispose();
      prediction.dispose();
      
      const baseRevenue = Math.max(0, revenue[0]);
      const uncertainty = baseRevenue * 0.15;
      
      return {
        predictedRevenue: Math.round(baseRevenue),
        lowerBound: Math.round(baseRevenue - uncertainty),
        upperBound: Math.round(baseRevenue + uncertainty),
        confidence: this.calculateRevenueConfidence(clientsData),
        timeframe: timeframe,
        trend: this.calculateTrend(clientsData)
      };
    } catch (error) {
      console.error('Error predicting revenue:', error);
      // Return safe default values
      const currentRevenue = this.calculateCurrentRevenue(clientsData);
      return { 
        predictedRevenue: currentRevenue, 
        lowerBound: Math.round(currentRevenue * 0.8), 
        upperBound: Math.round(currentRevenue * 1.2), 
        confidence: 'medium',
        timeframe: timeframe,
        trend: 'stable'
      };
    }
  }

  // Calculate current revenue as fallback
  calculateCurrentRevenue(clientsData) {
    return clientsData
      .filter(c => c.project?.price)
      .reduce((sum, c) => sum + parseFloat(c.project.price), 0);
  }

  // Extract features for project success prediction
  extractProjectFeatures(project) {
    const budget = parseFloat(project.price || 0);
    const progress = parseFloat(project.progress || 0);
    const daysElapsed = project.paymentDue ? 
      (new Date() - new Date(project.paymentDue)) / (1000 * 60 * 60 * 24) : 30;
    
    return [
      Math.min(budget / 100000, 1), // Normalized budget
      Math.min(Math.abs(daysElapsed) / 100, 1), // Normalized duration
      progress / 100, // Progress as decimal
      Math.random() * 0.3 + 0.6, // Communication frequency (mock - stable)
      Math.min((progress / 100) + Math.random() * 0.1, 1), // Tasks completed
      0.8 // Team size (normalized, mock)
    ];
  }

  // Extract features for revenue prediction
  extractRevenueFeatures(clientsData) {
    const totalRevenue = clientsData
      .filter(c => c.project?.price)
      .reduce((sum, c) => sum + parseFloat(c.project.price), 0);
    
    const activeClients = clientsData.filter(c => c.status === 'Active').length;
    const completedProjects = clientsData.filter(c => c.project?.progress === "100").length;
    const totalProjects = clientsData.filter(c => c.project).length;
    
    return [
      Math.min(totalRevenue / 1000000, 1), // Normalized revenue
      Math.min(activeClients / 50, 1), // Normalized client count
      Math.min(totalRevenue / Math.max(totalProjects, 1) / 50000, 1), // Normalized avg value
      Math.min(completedProjects / Math.max(totalProjects, 1), 1) // Completion rate
    ];
  }

  // Calculate prediction confidence
  calculateConfidence(probability) {
    if (probability > 0.8 || probability < 0.2) return 'high';
    if (probability > 0.6 || probability < 0.4) return 'medium';
    return 'low';
  }

  calculateRevenueConfidence(clientsData) {
    const dataPoints = clientsData.filter(c => c.project).length;
    if (dataPoints >= 10) return 'high';
    if (dataPoints >= 5) return 'medium';
    return 'low';
  }

  // Identify risk factors
  identifyRiskFactors(project) {
    const risks = [];
    const progress = parseFloat(project.progress || 0);
    const budget = parseFloat(project.price || 0);
    
    if (progress < 30) risks.push('Low initial progress');
    if (budget < 10000) risks.push('Limited budget');
    if (project.paymentDue) {
      const daysUntilDue = (new Date(project.paymentDue) - new Date()) / (1000 * 60 * 60 * 24);
      if (daysUntilDue < 7 && progress < 80) risks.push('Tight deadline');
      if (daysUntilDue < 0) risks.push('Overdue project');
    }
    
    return risks;
  }

  // Generate recommendations
  generateRecommendations(project, probability) {
    const recommendations = [];
    const progress = parseFloat(project.progress || 0);
    
    if (probability < 0.5) {
      recommendations.push('Schedule urgent review meeting');
      recommendations.push('Consider adjusting timeline or scope');
    } else if (probability < 0.7) {
      recommendations.push('Increase communication frequency');
      recommendations.push('Monitor key milestones closely');
    }
    
    if (progress < 25) {
      recommendations.push('Focus on initial deliverables');
    } else if (progress < 75) {
      recommendations.push('Maintain steady progress pace');
    }
    
    if (probability > 0.8) {
      recommendations.push('Project is on track - excellent work!');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue current approach'];
  }

  calculateTrend(clientsData) {
    const completedProjects = clientsData.filter(c => c.project?.progress === "100").length;
    const totalProjects = clientsData.filter(c => c.project).length;
    const completionRate = totalProjects > 0 ? completedProjects / totalProjects : 0;
    
    if (completionRate > 0.75) return 'increasing';
    if (completionRate > 0.4) return 'stable';
    return 'decreasing';
  }

  // Generate sample training data
  generateSampleProjectData() {
    const features = [];
    const labels = [];
    
    for (let i = 0; i < 50; i++) { // Reduced sample size for faster training
      const budget = Math.random();
      const duration = Math.random();
      const progress = Math.random();
      const communication = Math.random() * 0.3 + 0.6; // More stable
      const tasks = progress + (Math.random() * 0.1 - 0.05); // Related to progress
      const teamSize = 0.8;
      
      // Improved success logic
      const successProb = (
        budget * 0.15 + 
        progress * 0.5 + 
        communication * 0.2 + 
        Math.min(tasks, 1) * 0.15
      );
      const success = successProb > 0.5 ? 1 : 0;
      
      features.push([budget, duration, progress, communication, Math.min(tasks, 1), teamSize]);
      labels.push([success]);
    }
    
    return { features, labels };
  }

  generateSampleRevenueData() {
    const features = [];
    const labels = [];
    
    for (let i = 0; i < 50; i++) { // Reduced sample size
      const historicalRevenue = Math.random();
      const clientCount = Math.random();
      const avgValue = Math.random();
      const completionRate = Math.random();
      
      // More realistic revenue prediction
      const revenue = (
        historicalRevenue * 0.6 + 
        clientCount * 0.2 + 
        avgValue * 0.15 +
        completionRate * 0.05
      ) * 100000; // Scale to realistic numbers
      
      features.push([historicalRevenue, clientCount, avgValue, completionRate]);
      labels.push([Math.max(revenue, 0)]);
    }
    
    return { features, labels };
  }

  // Clean up models when done
  dispose() {
    if (this.projectSuccessModel) {
      this.projectSuccessModel.dispose();
    }
    if (this.revenueModel) {
      this.revenueModel.dispose();
    }
  }
}

// Create singleton instance
const mlService = new MLPredictionService();
export default mlService;