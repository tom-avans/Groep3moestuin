// src/config/Charts.js

export const chartColors = {
  temp: '#FF5252',
  ph: '#4CAF50',
  licht: '#FFC107',
  stroom: '#2196F3'
};

export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { 
      beginAtZero: false,
      ticks: { color: '#666' } 
    },
    x: {
      ticks: { color: '#666' }
    }
  },
  plugins: {
    legend: { display: false } 
  }
};