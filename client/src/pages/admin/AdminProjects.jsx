import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/admin/Modal.jsx';

const empty = {
  title: '', category: 'Web Development', client: '', summary: '', description: '',
  image: '', url: '', tags: '', featured: false, order: 0, active: true,
};

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/projects')
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(empty); setEditing('new'); };
  const openEdit = (p) => { setForm({ ...p, tags: (p.tags || []).join(', ') }); setEditing(p); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      order: Number(form.order) || 0,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (editing === 'new') {
        const res = await api.post('/projects', payload);
        setItems((prev) => [...prev, res.data.data]);
      } else {
        const res = await api.put(`/projects/${editing._id}`, payload);
        setItems((prev) => prev.map((p) => (p._id === editing._id ? res.data.data : p)));
      }
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
      setConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div><h1>Projects</h1><p>Manage the portfolio shown on your website.</p></div>
        <button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={17} /> New project</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Category</th><th>Featured</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id}>
                    <td><strong>{p.title}</strong></td>
                    <td>{p.category}</td>
                    <td>{p.featured ? <span className="status status-replied">featured</span> : '—'}</td>
                    <td><span className={`status ${p.active ? 'status-replied' : 'status-archived'}`}>{p.active ? 'active' : 'hidden'}</span></td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(p)} aria-label="Edit"><Icon name="edit" size={16} /></button>
                      <button className="icon-btn danger" onClick={() => setConfirm(p)} aria-label="Delete"><Icon name="trash" size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} title={editing === 'new' ? 'New project' : 'Edit project'} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="admin-form">
          <div className="field"><label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="two">
            <div className="field"><label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="field"><label>Client</label>
              <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
          </div>
          <div className="field"><label>Summary</label>
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div>
          <div className="field"><label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="two">
            <div className="field"><label>Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" /></div>
            <div className="field"><label>Project URL</label>
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></div>
          </div>
          <div className="two">
            <div className="field"><label>Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Node.js" /></div>
            <div className="field"><label>Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
          </div>
          <div className="checkrow">
            <label className="checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label className="checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Visible on website</label>
          </div>
          <div className="modal-foot inline">
            <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirm} title="Delete project?" onClose={() => setConfirm(null)}
        footer={<><button className="btn btn-light" onClick={() => setConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => remove(confirm._id)}>Delete</button></>}>
        {confirm && <p>Delete <strong>{confirm.title}</strong>? This cannot be undone.</p>}
      </Modal>
    </div>
  );
}
