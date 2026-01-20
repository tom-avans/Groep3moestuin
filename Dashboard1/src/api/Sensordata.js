// src/api/Sensordata.js

const API_URL = 'https://moestuingroep3.dedyn.io/getsensordata';

export default {
  async getData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Fout:', error);
      throw error;
    }
  }
};