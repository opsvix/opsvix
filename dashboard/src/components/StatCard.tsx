import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    trend?: number;
    color?: string;
    subtitle?: string;
}

const StatCard = ({ icon: Icon, label, value, trend, color = '#8b5cf6', subtitle }: StatCardProps) => {
    return (
        <div className="stat-card" style={{ '--accent': color } as React.CSSProperties}>
            <div className="stat-card-header">
                <div className="stat-icon" style={{ background: `${color}18`, color }}>
                    <Icon size={20} />
                </div>
                {trend !== undefined && (
                    <div className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
                        {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{Math.abs(trend).toFixed(1)}%</span>
                    </div>
                )}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
    );
};

export default StatCard;
