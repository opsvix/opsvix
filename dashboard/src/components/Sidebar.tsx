import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FolderKanban,
    MessageSquareQuote,
    Mail,
    BarChart3,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/testimonies', icon: MessageSquareQuote, label: 'Testimonies' },
    { to: '/enquiries', icon: Mail, label: 'Enquiries' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">◆</span>
                        <span className="logo-text">OPSVIX</span>
                    </div>
                    <span className="sidebar-badge">Admin</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            onClick={() => setCollapsed(true)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
