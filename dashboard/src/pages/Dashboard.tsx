import { useEffect, useState } from 'react';
import client from '../api/client';
import StatCard from '../components/StatCard';
import {
    Users,
    FolderKanban,
    Mail,
    TrendingUp,
    Eye,
    Clock,
    MousePointerClick,
    Activity,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import './Dashboard.css';

interface OverviewData {
    totalUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    newUsers: number;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444'];

const Dashboard = () => {
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [projectCount, setProjectCount] = useState(0);
    const [enquiryStats, setEnquiryStats] = useState({ total: 0, new: 0 });
    const [activeUsers, setActiveUsers] = useState(0);
    const [dailyTrend, setDailyTrend] = useState<any[]>([]);
    const [trafficSources, setTrafficSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Refresh active users every 30 seconds
        const interval = setInterval(loadActiveUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const [projectsRes, enquiryRes] = await Promise.all([
                client.get('/projects/all'),
                client.get('/enquiries/stats'),
            ]);
            setProjectCount(projectsRes.data.count);
            setEnquiryStats(enquiryRes.data.data);

            // Load analytics (may fail if GA4 not configured)
            try {
                const [overviewRes, activeRes, trendRes, trafficRes] = await Promise.all([
                    client.get('/analytics/overview'),
                    client.get('/analytics/realtime'),
                    client.get('/analytics/daily-trend'),
                    client.get('/analytics/traffic-sources'),
                ]);
                setOverview(overviewRes.data.data);
                setActiveUsers(activeRes.data.data.activeUsers);
                setDailyTrend(trendRes.data.data);
                setTrafficSources(trafficRes.data.data);
            } catch {
                console.warn('GA4 analytics not available');
            }
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadActiveUsers = async () => {
        try {
            const res = await client.get('/analytics/realtime');
            setActiveUsers(res.data.data.activeUsers);
        } catch { }
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        return `${m}m ${s}s`;
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loading-spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your portfolio and analytics</p>
            </div>

            {/* Live Active Users Banner */}
            <div className="live-banner">
                <div className="live-dot" />
                <span className="live-count">{activeUsers}</span>
                <span className="live-label">Active users right now</span>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={overview?.totalUsers?.toLocaleString() || '—'}
                    color="#8b5cf6"
                    subtitle="Last 30 days"
                />
                <StatCard
                    icon={Eye}
                    label="Page Views"
                    value={overview?.pageViews?.toLocaleString() || '—'}
                    color="#3b82f6"
                    subtitle="Last 30 days"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Bounce Rate"
                    value={overview ? `${overview.bounceRate}%` : '—'}
                    color={overview && overview.bounceRate > 50 ? '#ef4444' : '#22c55e'}
                    subtitle="Last 30 days"
                />
                <StatCard
                    icon={Clock}
                    label="Avg. Session"
                    value={overview ? formatDuration(overview.avgSessionDuration) : '—'}
                    color="#f59e0b"
                    subtitle="Last 30 days"
                />
                <StatCard
                    icon={FolderKanban}
                    label="Total Projects"
                    value={projectCount}
                    color="#06b6d4"
                />
                <StatCard
                    icon={Mail}
                    label="New Enquiries"
                    value={enquiryStats.new}
                    color="#ef4444"
                    subtitle={`${enquiryStats.total} total`}
                />
                <StatCard
                    icon={Activity}
                    label="Sessions"
                    value={overview?.sessions?.toLocaleString() || '—'}
                    color="#10b981"
                    subtitle="Last 30 days"
                />
                <StatCard
                    icon={MousePointerClick}
                    label="New Users"
                    value={overview?.newUsers?.toLocaleString() || '—'}
                    color="#f472b6"
                    subtitle="Last 30 days"
                />
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Daily Trend Chart */}
                <div className="chart-card">
                    <h3>Traffic Trend (Last 30 Days)</h3>
                    <div className="chart-container">
                        {dailyTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={dailyTrend}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#4a4a5a"
                                        fontSize={11}
                                        tickFormatter={(v) => `${v.slice(6, 8)}/${v.slice(4, 6)}`}
                                    />
                                    <YAxis stroke="#4a4a5a" fontSize={11} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1a1a24',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#e1e1e6',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#8b5cf6"
                                        fill="url(#colorUsers)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pageViews"
                                        stroke="#3b82f6"
                                        fill="url(#colorViews)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-empty">No analytics data available</div>
                        )}
                    </div>
                </div>

                {/* Traffic Sources Pie Chart */}
                <div className="chart-card">
                    <h3>Traffic Sources</h3>
                    <div className="chart-container">
                        {trafficSources.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={trafficSources}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="sessions"
                                        nameKey="channel"
                                    >
                                        {trafficSources.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1a1a24',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#e1e1e6',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-empty">No analytics data available</div>
                        )}
                        {trafficSources.length > 0 && (
                            <div className="chart-legend">
                                {trafficSources.map((item, i) => (
                                    <div key={i} className="legend-item">
                                        <div
                                            className="legend-dot"
                                            style={{ background: COLORS[i % COLORS.length] }}
                                        />
                                        <span>{item.channel}</span>
                                        <span className="legend-value">{item.sessions}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
