const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

let analyticsClient = null;

const getAnalyticsClient = () => {
  if (!analyticsClient) {
    const credentialsPath = process.env.GA4_CREDENTIALS_PATH || './ga-credentials.json';
    try {
      analyticsClient = new BetaAnalyticsDataClient({
        keyFilename: path.resolve(credentialsPath),
      });
      console.log('✅ GA4 Analytics client initialized');
    } catch (error) {
      console.warn('⚠️  GA4 Analytics client not configured:', error.message);
      return null;
    }
  }
  return analyticsClient;
};

const getPropertyId = () => {
  return process.env.GA4_PROPERTY_ID;
};

module.exports = { getAnalyticsClient, getPropertyId };
