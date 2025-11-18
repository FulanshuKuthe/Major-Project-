import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Shield, Lock, Unlock, Activity, Brain, Database, Zap, Eye, EyeOff, Play, Pause } from 'lucide-react';

const HomomorphicMLDashboard = () => {
  const [encryptionStatus, setEncryptionStatus] = useState('encrypted');
  const [modelRunning, setModelRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear_regression');
  const [processingTime, setProcessingTime] = useState(0);

  // Simulated encrypted vs decrypted data
  const [patientData, setPatientData] = useState({
    encrypted: [
      { id: 'P001', age: '***', bloodPressure: '***', heartRate: '***', glucose: '***', risk: '***' },
      { id: 'P002', age: '***', bloodPressure: '***', heartRate: '***', glucose: '***', risk: '***' },
      { id: 'P003', age: '***', bloodPressure: '***', heartRate: '***', glucose: '***', risk: '***' },
      { id: 'P004', age: '***', bloodPressure: '***', heartRate: '***', glucose: '***', risk: '***' },
      { id: 'P005', age: '***', bloodPressure: '***', heartRate: '***', glucose: '***', risk: '***' }
    ],
    decrypted: [
      { id: 'P001', age: 45, bloodPressure: 140, heartRate: 78, glucose: 110, risk: 0.65 },
      { id: 'P002', age: 62, bloodPressure: 160, heartRate: 85, glucose: 145, risk: 0.82 },
      { id: 'P003', age: 38, bloodPressure: 120, heartRate: 72, glucose: 95, risk: 0.35 },
      { id: 'P004', age: 55, bloodPressure: 135, heartRate: 80, glucose: 125, risk: 0.58 },
      { id: 'P005', age: 41, bloodPressure: 125, heartRate: 75, glucose: 105, risk: 0.42 }
    ]
  });

  const algorithms = {
    linear_regression: 'Linear Regression',
    logistic_regression: 'Logistic Regression',
    neural_network: 'Neural Network',
    decision_tree: 'Decision Tree',
    svm: 'Support Vector Machine'
  };

  const performanceMetrics = [
    { name: 'Accuracy', encrypted: 87.5, decrypted: 89.2 },
    { name: 'Precision', encrypted: 85.3, decrypted: 88.1 },
    { name: 'Recall', encrypted: 83.7, decrypted: 86.4 },
    { name: 'F1-Score', encrypted: 84.5, decrypted: 87.2 }
  ];

  const encryptionOverhead = [
    { operation: 'Data Loading', normal: 0.5, encrypted: 2.3 },
    { operation: 'Training', normal: 15.2, encrypted: 45.8 },
    { operation: 'Inference', normal: 0.8, encrypted: 3.2 },
    { operation: 'Validation', normal: 2.1, encrypted: 8.4 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 35, color: '#10B981' },
    { name: 'Medium Risk', value: 45, color: '#F59E0B' },
    { name: 'High Risk', value: 20, color: '#EF4444' }
  ];

  useEffect(() => {
    if (modelRunning) {
      const interval = setInterval(() => {
        setProcessingTime(prev => prev + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [modelRunning]);

  const toggleEncryption = () => {
    setEncryptionStatus(prev => prev === 'encrypted' ? 'decrypted' : 'encrypted');
  };

  const toggleModel = () => {
    setModelRunning(prev => !prev);
    if (!modelRunning) {
      setProcessingTime(0);
    }
  };

  const currentData = patientData[encryptionStatus];
  const isEncrypted = encryptionStatus === 'encrypted';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Homomorphic Encryption ML Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-medium">Encrypted at Rest</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300">
            Secure machine learning on encrypted healthcare data using homomorphic encryption
          </p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Encryption Status</span>
              {isEncrypted ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-green-400" />}
            </div>
            <button
              onClick={toggleEncryption}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isEncrypted 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isEncrypted ? 'Decrypt Data' : 'Encrypt Data'}
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Model Status</span>
              {modelRunning ? <Play className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-gray-400" />}
            </div>
            <button
              onClick={toggleModel}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                modelRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {modelRunning ? 'Stop Training' : 'Start Training'}
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Algorithm</span>
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-white"
            >
              {Object.entries(algorithms).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Processing Time</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-lg font-mono">
              {processingTime.toFixed(1)}s
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Patient Data Table */}
          <div className="xl:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-400" />
                Patient Data
              </h3>
              <div className="flex items-center space-x-2">
                {isEncrypted ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-green-400" />}
                <span className={`text-sm ${isEncrypted ? 'text-red-400' : 'text-green-400'}`}>
                  {isEncrypted ? 'Encrypted' : 'Decrypted'}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2">Patient ID</th>
                    <th className="text-left py-2">Age</th>
                    <th className="text-left py-2">Blood Pressure</th>
                    <th className="text-left py-2">Heart Rate</th>
                    <th className="text-left py-2">Glucose</th>
                    <th className="text-left py-2">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((patient, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 font-mono">{patient.id}</td>
                      <td className="py-2">{patient.age}</td>
                      <td className="py-2">{patient.bloodPressure}</td>
                      <td className="py-2">{patient.heartRate}</td>
                      <td className="py-2">{patient.glucose}</td>
                      <td className="py-2">
                        {typeof patient.risk === 'number' ? (
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              patient.risk > 0.7 ? 'bg-red-400' : 
                              patient.risk > 0.5 ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                            {patient.risk.toFixed(2)}
                          </div>
                        ) : (
                          patient.risk
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              Risk Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="xl:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              Model Performance (Encrypted vs Decrypted)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Bar dataKey="encrypted" fill="#EF4444" name="Encrypted Processing" />
                  <Bar dataKey="decrypted" fill="#10B981" name="Decrypted Processing" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Encryption Overhead */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Processing Overhead
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={encryptionOverhead} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="operation" type="category" stroke="#9CA3AF" width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Bar dataKey="normal" fill="#3B82F6" name="Standard" />
                  <Bar dataKey="encrypted" fill="#F59E0B" name="Homomorphic" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Status */}
          <div className="xl:col-span-3 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">System Status & Security Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Encryption Scheme</span>
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-sm font-medium text-green-400">BFV Homomorphic</div>
                <div className="text-xs text-gray-400">2048-bit security</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Key Management</span>
                  <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-sm font-medium text-blue-400">HSM Protected</div>
                <div className="text-xs text-gray-400">FIPS 140-2 Level 3</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Privacy Level</span>
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-sm font-medium text-purple-400">Zero-Knowledge</div>
                <div className="text-xs text-gray-400">Differential Privacy</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Audit Trail</span>
                  <Activity className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-sm font-medium text-yellow-400">Active</div>
                <div className="text-xs text-gray-400">Immutable Logs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">
              <strong>Homomorphic Encryption:</strong> Enables computation on encrypted data without decryption
            </p>
            <p>
              Healthcare data remains encrypted during ML training and inference, ensuring patient privacy while enabling medical insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomomorphicMLDashboard;