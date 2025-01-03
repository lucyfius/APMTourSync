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

  async getProperties() {
    try {
      return await window.api.database.getProperties();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async createProperty(propertyData) {
    try {
      return await window.api.database.createProperty(propertyData);
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async updateTour(tourId, tourData) {
    try {
      return await window.api.database.updateTour(tourId, tourData);
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  }

  async updateProperty(propertyId, propertyData) {
    try {
      return await window.api.database.updateProperty(propertyId, propertyData);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async cleanupOldTours() {
    try {
      return await window.api.database.cleanupOldTours();
    } catch (error) {
      console.error('Error cleaning up old tours:', error);
      throw error;
    }
  }

  async deleteProperty(propertyId) {
    try {
      return await window.api.database.deleteProperty(propertyId);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
}

export default new Database(); 