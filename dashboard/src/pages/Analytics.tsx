import { useEffect, useState } from 'react';
import client from '../api/client';
import StatCard from '../components/StatCard';
import {
    Users,
    Eye,
    TrendingUp,
    Clock,
    MousePointerClick,
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    Activity,
    Zap,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import './Analytics.css';

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#f472b6', '#a78bfa'];

const deviceIcons: Record<string, any> = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
};

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [activeUsers, setActiveUsers] = useState(0);
    const [overview, setOverview] = useState<any>(null);
    const [dailyTrend, setDailyTrend] = useState<any[]>([]);
    const [trafficSources, setTrafficSources] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [devices, setDevices] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [contactClicks, setContactClicks] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAll();
        const interval = setInterval(loadRealtime, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadRealtime = async () => {
        try {
            const res = await client.get('/analytics/realtime');
            setActiveUsers(res.data.data.activeUsers);
        } catch { }
    };

    const loadAll = async () => {
        try {
            const [
                realtimeRes,
                overviewRes,
                trendRes,
                trafficRes,
                pagesRes,
                countriesRes,
                devicesRes,
                eventsRes,
                contactRes,
            ] = await Promise.all([
                client.get('/analytics/realtime'),
                client.get('/analytics/overview'),
                client.get('/analytics/daily-trend'),
                client.get('/analytics/traffic-sources'),
                client.get('/analytics/pages'),
                client.get('/analytics/countries'),
                client.get('/analytics/devices'),
                client.get('/analytics/events'),
                client.get('/analytics/contact-clicks'),
            ]);

            setActiveUsers(realtimeRes.data.data.activeUsers);
            setOverview(overviewRes.data.data);
            setDailyTrend(trendRes.data.data);
            setTrafficSources(trafficRes.data.data);
            setPages(pagesRes.data.data);
            setCountries(countriesRes.data.data);
            setDevices(devicesRes.data.data);
            setEvents(eventsRes.data.data);
            setContactClicks(contactRes.data.data);
        } catch (err: any) {
            setError('GA4 Analytics is not configured. Please set up your GA4 credentials.');
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        return `${m}m ${s}s`;
    };

    if (loading) {
        return <div className="page-loading"><div className="loading-spinner" /></div>;
    }

    if (error) {
        return (
            <div className="analytics-page">
                <div className="page-header">
                    <h1>Analytics</h1>
                </div>
                <div className="analytics-error">
                    <Activity size={48} />
                    <h3>Analytics Not Configured</h3>
                    <p>{error}</p>
                    <div className="error-steps">
                        <p>To set up analytics:</p>
                        <ol>
                            <li>Create a GA4 property and get the Property ID</li>
                            <li>Create a Service Account with <strong>Viewer</strong> role</li>
                            <li>Download the JSON key file as <code>ga-credentials.json</code></li>
                            <li>Add the Service Account email to your GA4 property</li>
                            <li>Set <code>GA4_PROPERTY_ID</code> and <code>GA4_CREDENTIALS_PATH</code> in <code>.env</code></li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="page-header">
                <h1>Analytics</h1>
                <p>Google Analytics 4 — Last 30 days</p>
            </div>

            {/* Live Banner */}
            <div className="live-banner">
                <div className="live-dot" />
                <span className="live-count">{activeUsers}</span>
                <span className="live-label">Active users right now</span>
            </div>

            {/* Overview Stats */}
            <div className="stats-grid">
                <StatCard icon={Users} label="Total Users" value={overview?.totalUsers?.toLocaleString() || 0} color="#8b5cf6" />
                <StatCard icon={Eye} label="Page Views" value={overview?.pageViews?.toLocaleString() || 0} color="#3b82f6" />
                <StatCard icon={TrendingUp} label="Bounce Rate" value={`${overview?.bounceRate || 0}%`} color={overview?.bounceRate > 50 ? '#ef4444' : '#22c55e'} />
                <StatCard icon={Clock} label="Avg. Session" value={overview ? formatDuration(overview.avgSessionDuration) : '0m'} color="#f59e0b" />
                <StatCard icon={Activity} label="Sessions" value={overview?.sessions?.toLocaleString() || 0} color="#06b6d4" />
                <StatCard icon={MousePointerClick} label="New Users" value={overview?.newUsers?.toLocaleString() || 0} color="#f472b6" />
                <StatCard
                    icon={Zap}
                    label="Contact Click Rate"
                    value={`${contactClicks?.clickRate || 0}%`}
                    color="#10b981"
                    subtitle={`${contactClicks?.totalContactClicks || 0} clicks`}
                />
                <StatCard icon={Globe} label="Engaged Sessions" value={overview?.engagedSessions?.toLocaleString() || 0} color="#a78bfa" />
            </div>

            {/* Daily Trend */}
            <div className="chart-card full-width">
                <h3>Traffic Trend</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={dailyTrend}>
                            <defs>
                                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gPageViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="#4a4a5a" fontSize={11} tickFormatter={(v) => `${v.slice(6, 8)}/${v.slice(4, 6)}`} />
                            <YAxis stroke="#4a4a5a" fontSize={11} />
                            <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e1e1e6' }} />
                            <Legend />
                            <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="url(#gUsers)" strokeWidth={2} />
                            <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="url(#gSessions)" strokeWidth={2} />
                            <Area type="monotone" dataKey="pageViews" stroke="#06b6d4" fill="url(#gPageViews)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="charts-grid">
                {/* Traffic Sources */}
                <div className="chart-card">
                    <h3>Traffic Sources</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="sessions" nameKey="channel">
                                    {trafficSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e1e1e6' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-legend">
                            {trafficSources.map((item, i) => (
                                <div key={i} className="legend-item">
                                    <div className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span>{item.channel}</span>
                                    <span className="legend-value">{item.sessions}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Devices */}
                <div className="chart-card">
                    <h3>Device Breakdown</h3>
                    <div className="device-list">
                        {devices.map((d, i) => {
                            const Icon = deviceIcons[d.device?.toLowerCase()] || Monitor;
                            const total = devices.reduce((s: number, x: any) => s + x.users, 0);
                            const pct = total > 0 ? ((d.users / total) * 100).toFixed(1) : 0;
                            return (
                                <div key={i} className="device-item">
                                    <div className="device-icon" style={{ color: COLORS[i] }}>
                                        <Icon size={22} />
                                    </div>
                                    <div className="device-info">
                                        <span className="device-name">{d.device}</span>
                                        <div className="device-bar">
                                            <div className="device-bar-fill" style={{ width: `${pct}%`, background: COLORS[i] }} />
                                        </div>
                                    </div>
                                    <div className="device-stats">
                                        <span className="device-users">{d.users}</span>
                                        <span className="device-pct">{pct}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Top Pages */}
                <div className="chart-card">
                    <h3>Top Pages</h3>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>Views</th>
                                    <th>Users</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.slice(0, 10).map((p, i) => (
                                    <tr key={i}>
                                        <td className="page-path">{p.pagePath}</td>
                                        <td>{p.pageViews?.toLocaleString()}</td>
                                        <td>{p.users?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Countries */}
                <div className="chart-card">
                    <h3>Top Countries</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={countries.slice(0, 10)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="#4a4a5a" fontSize={11} />
                                <YAxis type="category" dataKey="country" stroke="#4a4a5a" fontSize={11} width={100} />
                                <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e1e1e6' }} />
                                <Bar dataKey="users" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Custom Events */}
            <div className="chart-card full-width">
                <h3>Custom Events</h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Count</th>
                                <th>Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((e, i) => (
                                <tr key={i}>
                                    <td>
                                        <span className="event-name">{e.eventName}</span>
                                    </td>
                                    <td>{e.eventCount?.toLocaleString()}</td>
                                    <td>{e.users?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
