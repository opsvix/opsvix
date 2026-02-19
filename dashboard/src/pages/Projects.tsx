import { useEffect, useState } from 'react';
import client from '../api/client';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, ExternalLink, Github, Star } from 'lucide-react';
import './Projects.css';

interface Project {
    _id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: string;
    technologies: string[];
    images: { url: string; publicId: string }[];
    thumbnail: { url: string; publicId: string };
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    status: string;
    order: number;
    createdAt: string;
}

const defaultForm = {
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'published',
    order: 0,
};

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [thumbnailFile, setThumbnailFile] = useState<FileList | null>(null);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await client.get('/projects/all');
            setProjects(res.data.data);
        } catch (err) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(defaultForm);
        setThumbnailFile(null);
        setImageFiles(null);
        setModalOpen(true);
    };

    const openEdit = (project: Project) => {
        setEditingId(project._id);
        setForm({
            title: project.title,
            description: project.description || '',
            shortDescription: project.shortDescription || '',
            category: project.category || '',
            technologies: project.technologies?.join(', ') || '',
            liveUrl: project.liveUrl || '',
            githubUrl: project.githubUrl || '',
            featured: project.featured,
            status: project.status,
            order: project.order,
        });
        setThumbnailFile(null);
        setImageFiles(null);
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, String(value));
            });

            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile[0]);
            }
            if (imageFiles) {
                Array.from(imageFiles).forEach((f) => formData.append('images', f));
            }

            if (editingId) {
                await client.put(`/projects/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Project updated!');
            } else {
                await client.post('/projects', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Project created!');
            }

            setModalOpen(false);
            loadProjects();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await client.delete(`/projects/${id}`);
            toast.success('Project deleted');
            loadProjects();
        } catch {
            toast.error('Failed to delete project');
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="projects-page">
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p>{projects.length} total projects</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project._id} className="project-card">
                        <div className="project-thumb">
                            {project.thumbnail?.url ? (
                                <img src={project.thumbnail.url} alt={project.title} />
                            ) : (
                                <div className="thumb-placeholder">No Image</div>
                            )}
                            <div className="project-badges">
                                <span className={`status-badge ${project.status}`}>
                                    {project.status}
                                </span>
                                {project.featured && (
                                    <span className="featured-badge">
                                        <Star size={12} /> Featured
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="project-info">
                            <h3>{project.title}</h3>
                            {project.category && <span className="project-category">{project.category}</span>}
                            {project.technologies?.length > 0 && (
                                <div className="project-techs">
                                    {project.technologies.slice(0, 4).map((t, i) => (
                                        <span key={i} className="tech-tag">{t}</span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                        <span className="tech-tag more">+{project.technologies.length - 4}</span>
                                    )}
                                </div>
                            )}
                            <div className="project-actions">
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noopener" className="action-link">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener" className="action-link">
                                        <Github size={14} />
                                    </a>
                                )}
                                <button className="action-btn edit" onClick={() => openEdit(project)}>
                                    <Pencil size={14} />
                                </button>
                                <button className="action-btn delete" onClick={() => handleDelete(project._id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="empty-state">
                    <p>No projects yet. Add your first project!</p>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingId ? 'Edit Project' : 'New Project'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                                placeholder="Project name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                placeholder="e.g. Web App, Mobile"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Short Description</label>
                        <input
                            type="text"
                            value={form.shortDescription}
                            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                            placeholder="Brief one-liner"
                            maxLength={300}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Detailed project description"
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>Technologies (comma-separated)</label>
                        <input
                            type="text"
                            value={form.technologies}
                            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Live URL</label>
                            <input
                                type="url"
                                value={form.liveUrl}
                                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="form-group">
                            <label>GitHub URL</label>
                            <input
                                type="url"
                                value={form.githubUrl}
                                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Order</label>
                            <input
                                type="number"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                            />
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
                        label="Thumbnail"
                        name="thumbnail"
                        onChange={setThumbnailFile}
                        preview={editingId ? projects.find((p) => p._id === editingId)?.thumbnail?.url : undefined}
                    />

                    <ImageUploader
                        label="Project Images"
                        name="images"
                        multiple
                        onChange={setImageFiles}
                        preview={editingId ? projects.find((p) => p._id === editingId)?.images?.map((i) => i.url) : undefined}
                    />

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
