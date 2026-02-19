const express = require('express');
const { protect } = require('../middleware/auth');
const { getAnalyticsClient, getPropertyId } = require('../config/analytics');
const router = express.Router();

// All analytics routes are admin-only
router.use(protect);

// Helper: run a GA4 report
const runReport = async (request) => {
  const client = getAnalyticsClient();
  if (!client) {
    throw new Error('GA4 Analytics is not configured');
  }
  const [response] = await client.runReport(request);
  return response;
};

// Helper: run a GA4 realtime report
const runRealtimeReport = async (request) => {
  const client = getAnalyticsClient();
  if (!client) {
    throw new Error('GA4 Analytics is not configured');
  }
  const [response] = await client.runRealtimeReport(request);
  return response;
};

// Helper: format report rows
const formatRows = (response, dimNames, metricNames) => {
  if (!response.rows) return [];
  return response.rows.map((row) => {
    const obj = {};
    row.dimensionValues?.forEach((dim, i) => {
      obj[dimNames[i]] = dim.value;
    });
    row.metricValues?.forEach((met, i) => {
      obj[metricNames[i]] = Number(met.value);
    });
    return obj;
  });
};

// GET /api/analytics/realtime — Active users right now
router.get('/realtime', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const response = await runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: 'activeUsers' }],
    });

    const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || '0';

    res.json({
      success: true,
      data: { activeUsers: Number(activeUsers) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/overview — Summary metrics (last 30 days)
router.get('/overview', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today' } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'engagedSessions' },
        { name: 'newUsers' },
      ],
    });

    const values = response.rows?.[0]?.metricValues || [];
    const data = {
      totalUsers: Number(values[0]?.value || 0),
      sessions: Number(values[1]?.value || 0),
      pageViews: Number(values[2]?.value || 0),
      bounceRate: parseFloat((Number(values[3]?.value || 0) * 100).toFixed(2)),
      avgSessionDuration: Number(values[4]?.value || 0),
      engagedSessions: Number(values[5]?.value || 0),
      newUsers: Number(values[6]?.value || 0),
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/pages — Page views by page path
router.get('/pages', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today', limit = 20 } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: Number(limit),
    });

    const data = formatRows(
      response,
      ['pagePath', 'pageTitle'],
      ['pageViews', 'users', 'avgDuration']
    );

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/traffic-sources — Traffic breakdown
router.get('/traffic-sources', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today' } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });

    const data = formatRows(response, ['channel'], ['sessions', 'users']);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/countries — Users by country
router.get('/countries', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today', limit = 20 } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: Number(limit),
    });

    const data = formatRows(response, ['country'], ['users', 'sessions']);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/devices — Users by device category
router.get('/devices', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today' } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    });

    const data = formatRows(response, ['device'], ['users', 'sessions']);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/events — Custom events
router.get('/events', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today', limit = 30 } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: Number(limit),
    });

    const data = formatRows(response, ['eventName'], ['eventCount', 'users']);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/contact-clicks — Contact form click rate
router.get('/contact-clicks', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today' } = req.query;

    // Get total sessions
    const totalResponse = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'sessions' }],
    });

    // Get contact-related event clicks
    const contactResponse = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        orGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: { matchType: 'CONTAINS', value: 'contact' },
              },
            },
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: { matchType: 'CONTAINS', value: 'cta' },
              },
            },
          ],
        },
      },
    });

    const totalSessions = Number(
      totalResponse.rows?.[0]?.metricValues?.[0]?.value || 0
    );

    const contactEvents = formatRows(
      contactResponse,
      ['eventName'],
      ['eventCount']
    );

    const totalContactClicks = contactEvents.reduce(
      (sum, e) => sum + e.eventCount,
      0
    );

    const clickRate =
      totalSessions > 0
        ? parseFloat(((totalContactClicks / totalSessions) * 100).toFixed(2))
        : 0;

    res.json({
      success: true,
      data: {
        totalSessions,
        totalContactClicks,
        clickRate,
        events: contactEvents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/analytics/daily-trend — Daily users/sessions trend
router.get('/daily-trend', async (req, res) => {
  try {
    const propertyId = getPropertyId();
    const { startDate = '30daysAgo', endDate = 'today' } = req.query;

    const response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const data = formatRows(
      response,
      ['date'],
      ['users', 'sessions', 'pageViews']
    );

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
