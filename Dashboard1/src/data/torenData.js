// src/data/torenData.js

export const torenData = {
  // Get all towers from storage
  getTowers() {
    const data = localStorage.getItem('towers_db');
    return data ? JSON.parse(data) : [];
  },

  // Add a new tower and return the updated list
  addTower(tower) {
    const towers = this.getTowers();
    const newTower = { 
      ...tower, 
      id: crypto.randomUUID() // Generates a unique ID
    };
    towers.push(newTower);
    localStorage.setItem('towers_db', JSON.stringify(towers));
    return towers;
  },

  // Delete a tower and return the updated list
  deleteTower(id) {
    let towers = this.getTowers();
    towers = towers.filter(t => t.id !== id);
    localStorage.setItem('towers_db', JSON.stringify(towers));
    return towers;
  }
};