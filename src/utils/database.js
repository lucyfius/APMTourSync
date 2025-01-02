class Database {
  async getTours() {
    try {
      return await window.api.database.getTours();
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }

  async createTour(tourData) {
    try {
      return await window.api.database.createTour(tourData);
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }
}

export default new Database(); 