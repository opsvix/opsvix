import { useEffect, useState } from 'react';
import client from '../api/client';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Star, Quote } from 'lucide-react';
import './Testimonies.css';

interface Testimony {
    _id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: { url: string; publicId: string };
    rating: number;
    featured: boolean;
    order: number;
    createdAt: string;
}

const defaultForm = {
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    featured: false,
    order: 0,
};

const Testimonies = () => {
    const [testimonies, setTestimonies] = useState<Testimony[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [avatarFile, setAvatarFile] = useState<FileList | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTestimonies();
    }, []);

    const loadTestimonies = async () => {
        try {
            const res = await client.get('/testimonies');
            setTestimonies(res.data.data);
        } catch {
            toast.error('Failed to load testimonies');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(defaultForm);
        setAvatarFile(null);
        setModalOpen(true);
    };

    const openEdit = (t: Testimony) => {
        setEditingId(t._id);
        setForm({
            name: t.name,
            role: t.role || '',
            company: t.company || '',
            content: t.content,
            rating: t.rating,
            featured: t.featured,
            order: t.order,
        });
        setAvatarFile(null);
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, val]) => formData.append(key, String(val)));
            if (avatarFile) formData.append('avatar', avatarFile[0]);

            if (editingId) {
                await client.put(`/testimonies/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Testimony updated!');
            } else {
                await client.post('/testimonies', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Testimony created!');
            }
            setModalOpen(false);
            loadTestimonies();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimony?')) return;
        try {
            await client.delete(`/testimonies/${id}`);
            toast.success('Deleted');
            loadTestimonies();
        } catch {
            toast.error('Failed to delete');
        }
    };

    if (loading) {
        return <div className="page-loading"><div className="loading-spinner" /></div>;
    }

    return (
        <div className="testimonies-page">
            <div className="page-header">
                <div>
                    <h1>Testimonies</h1>
                    <p>{testimonies.length} testimonials</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    <Plus size={18} /> Add Testimony
                </button>
            </div>

            <div className="testimonies-grid">
                {testimonies.map((t) => (
                    <div key={t._id} className="testimony-card">
                        <div className="testimony-header">
                            <div className="testimony-avatar">
                                {t.avatar?.url ? (
                                    <img src={t.avatar.url} alt={t.name} />
                                ) : (
                                    <div className="avatar-placeholder">{t.name[0]}</div>
                                )}
                            </div>
                            <div>
                                <h4>{t.name}</h4>
                                <span className="testimony-role">
                                    {t.role}{t.company ? ` at ${t.company}` : ''}
                                </span>
                            </div>
                            {t.featured && <Star size={16} className="testimony-star" />}
                        </div>
                        <div className="testimony-content">
                            <Quote size={16} className="quote-icon" />
                            <p>{t.content}</p>
                        </div>
                        <div className="testimony-footer">
                            <div className="rating">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < t.rating ? '#f59e0b' : 'transparent'}
                                        stroke={i < t.rating ? '#f59e0b' : '#4a4a5a'}
                                    />
                                ))}
                            </div>
                            <div className="testimony-actions">
                                <button className="action-btn edit" onClick={() => openEdit(t)}>
                                    <Pencil size={14} />
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(t._id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {testimonies.length === 0 && (
                <div className="empty-state"><p>No testimonies yet</p></div>
            )}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingId ? 'Edit Testimony' : 'New Testimony'}
            >
                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <input
                                type="text"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                placeholder="e.g. CEO"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Company</label>
                        <input
                            type="text"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            required
                            rows={4}
                            placeholder="What did they say?"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Rating</label>
                            <select
                                value={form.rating}
                                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>{n} Stars</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                />
                                Featured
                            </label>
                        </div>
                    </div>
                    <ImageUploader
                        label="Avatar"
                        name="avatar"
                        onChange={setAvatarFile}
                        preview={editingId ? testimonies.find((t) => t._id === editingId)?.avatar?.url : undefined}
                    />
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Testimonies;
