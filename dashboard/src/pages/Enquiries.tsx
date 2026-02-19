import { useEffect, useState } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Mail, MailOpen, Reply, Trash2, Clock } from 'lucide-react';
import './Enquiries.css';

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

const statusConfig = {
    new: { icon: Mail, color: '#8b5cf6', label: 'New' },
    read: { icon: MailOpen, color: '#3b82f6', label: 'Read' },
    replied: { icon: Reply, color: '#22c55e', label: 'Replied' },
};

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [selected, setSelected] = useState<Enquiry | null>(null);

    useEffect(() => {
        loadEnquiries();
    }, [filter]);

    const loadEnquiries = async () => {
        try {
            const params = filter ? { status: filter } : {};
            const res = await client.get('/enquiries', { params });
            setEnquiries(res.data.data);
        } catch {
            toast.error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await client.patch(`/enquiries/${id}/status`, { status });
            toast.success(`Marked as ${status}`);
            loadEnquiries();
            if (selected?._id === id) {
                setSelected({ ...selected, status: status as Enquiry['status'] });
            }
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this enquiry?')) return;
        try {
            await client.delete(`/enquiries/${id}`);
            toast.success('Deleted');
            if (selected?._id === id) setSelected(null);
            loadEnquiries();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const formatDate = (d: string) => {
        return new Date(d).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return <div className="page-loading"><div className="loading-spinner" /></div>;
    }

    return (
        <div className="enquiries-page">
            <div className="page-header">
                <div>
                    <h1>Enquiries</h1>
                    <p>{enquiries.length} enquiries</p>
                </div>
                <div className="filter-tabs">
                    {['', 'new', 'read', 'replied'].map((f) => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="enquiries-layout">
                <div className="enquiries-list">
                    {enquiries.map((enq) => {
                        const cfg = statusConfig[enq.status];
                        return (
                            <div
                                key={enq._id}
                                className={`enquiry-item ${selected?._id === enq._id ? 'selected' : ''} ${enq.status === 'new' ? 'unread' : ''}`}
                                onClick={() => {
                                    setSelected(enq);
                                    if (enq.status === 'new') updateStatus(enq._id, 'read');
                                }}
                            >
                                <div className="enquiry-item-header">
                                    <span className="enquiry-name">{enq.name}</span>
                                    <span className={`enquiry-status status-${enq.status}`}>
                                        <cfg.icon size={12} />
                                        {cfg.label}
                                    </span>
                                </div>
                                <div className="enquiry-subject">{enq.subject || 'No subject'}</div>
                                <div className="enquiry-preview">{enq.message.slice(0, 80)}...</div>
                                <div className="enquiry-time">
                                    <Clock size={12} />
                                    {formatDate(enq.createdAt)}
                                </div>
                            </div>
                        );
                    })}
                    {enquiries.length === 0 && (
                        <div className="empty-state"><p>No enquiries found</p></div>
                    )}
                </div>

                <div className="enquiry-detail">
                    {selected ? (
                        <>
                            <div className="detail-header">
                                <div>
                                    <h2>{selected.name}</h2>
                                    <a href={`mailto:${selected.email}`} className="detail-email">
                                        {selected.email}
                                    </a>
                                    {selected.phone && <span className="detail-phone">{selected.phone}</span>}
                                </div>
                                <div className="detail-actions">
                                    <button
                                        className="action-btn edit"
                                        onClick={() => updateStatus(selected._id, 'replied')}
                                        title="Mark as replied"
                                    >
                                        <Reply size={16} />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(selected._id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            {selected.subject && (
                                <div className="detail-subject">{selected.subject}</div>
                            )}
                            <div className="detail-message">{selected.message}</div>
                            <div className="detail-meta">
                                <Clock size={14} />
                                {formatDate(selected.createdAt)}
                            </div>
                        </>
                    ) : (
                        <div className="detail-empty">
                            <Mail size={48} />
                            <p>Select an enquiry to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Enquiries;
