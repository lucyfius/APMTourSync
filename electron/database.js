const { MongoClient } = require('mongodb');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// In development, use dotenv
if (isDev) {
  require('dotenv').config({
    path: path.join(process.cwd(), '.env')
  });
}

class Database {
  constructor() {
    // Default connection string for production
    const defaultUri = 'your_production_mongodb_uri';
    
    this.uri = process.env.MONGODB_URI || defaultUri;
    if (!this.uri) {
      throw new Error('MongoDB URI not configured');
    }
    
    console.log('Initializing database connection...');
    this.client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });
    
    this.dbName = process.env.MONGODB_DB || 'toursync';
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;

    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      await this.db.command({ ping: 1 });
      this.isConnected = true;
      console.log('Connected successfully to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB Atlas connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async ensureConnection() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  async getTours() {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      const result = await this.db.collection('tours').find().toArray();
      
      // Transform MongoDB ObjectIds to strings
      const transformedResult = result.map(tour => ({
        ...tour,
        _id: tour._id.toString()
      }));
      
      console.log('Tours fetched:', transformedResult);
      return transformedResult;
    } catch (error) {
      console.error('Error in getTours:', error);
      throw error;
    }
  }

  async createTour(tourData) {
    try {
      await this.ensureConnection();
      const result = await this.db.collection('tours').insertOne({
        ...tourData,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('Tour created:', result);
      return result;
    } catch (error) {
      console.error('Error in createTour:', error);
      throw error;
    }
  }

  async deleteTour(tourId) {
    try {
      await this.ensureConnection();
      const { ObjectId } = require('mongodb');
      
      console.log('Raw tourId:', tourId);
      console.log('tourId type:', typeof tourId);
      
      if (!tourId || typeof tourId !== 'string' || tourId.length !== 24) {
        console.error('Invalid tour ID format:', tourId);
        throw new Error('Invalid tour ID format');
      }
      
      const objectId = new ObjectId(tourId);
      console.log('Created ObjectId:', objectId);
      
      const result = await this.db.collection('tours').deleteOne({
        _id: objectId
      });
      
      console.log('Delete result:', result);
      
      if (result.deletedCount === 0) {
        throw new Error('Tour not found or not deleted');
      }
      
      return result;
    } catch (error) {
      console.error('Error in deleteTour:', error);
      throw error;
    }
  }

  async getProperties() {
    try {
      await this.ensureConnection();
      const result = await this.db.collection('properties').find().toArray();
      return result.map(property => ({
        ...property,
        _id: property._id.toString()
      }));
    } catch (error) {
      console.error('Error in getProperties:', error);
      throw error;
    }
  }

  async createProperty(propertyData) {
    try {
      await this.ensureConnection();
      const result = await this.db.collection('properties').insertOne({
        ...propertyData,
        created_at: new Date(),
        updated_at: new Date()
      });
      return result;
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  // Add other database methods here...
}

module.exports = Database; 