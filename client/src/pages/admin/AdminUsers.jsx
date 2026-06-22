import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/admin/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ROLES = ['editor', 'admin', 'superadmin'];
const roleLabel = { superadmin: 'Super Admin', admin: 'Admin', editor: 'Editor' };
const empty = { name: '', email: '', password: '', role: 'editor', active: true };

export default function AdminUsers() {
  const { user: me } = useAuth();
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
      .get('/users')
      .then((res) => setItems(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(empty); setEditing('new'); setError(''); };
  const openEdit = (u) => { setForm({ ...u, password: '' }); setEditing(u); setError(''); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') {
        const res = await api.post('/users', form);
        setItems((prev) => [res.data.data, ...prev]);
      } else {
        const payload = { name: form.name, email: form.email, role: form.role, active: form.active };
        if (form.password) payload.password = form.password;
        const res = await api.put(`/users/${editing._id}`, payload);
        setItems((prev) => prev.map((u) => (u._id === editing._id ? { ...u, ...res.data.data } : u)));
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
      await api.delete(`/users/${id}`);
      setItems((prev) => prev.filter((u) => u._id !== id));
      setConfirm(null);
    } catch (err) {
      setError(err.message);
      setConfirm(null);
    }
  };

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Users &amp; roles</h1>
          <p>Super admins control everything. Admins manage content; editors have limited access.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={17} /> New user</button>
      </div>

      {error && !editing && <div className="alert error">{error}</div>}

      <div className="panel">
        {loading && <p className="muted-center">Loading…</p>}
        {!loading && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th></th></tr></thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="cell-icon">
                        <div className="mini-avatar">{u.name.charAt(0).toUpperCase()}</div>
                        <strong>{u.name}{u._id === me?.id && <span className="you-tag">you</span>}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`role-pill role-${u.role}`}>{roleLabel[u.role]}</span></td>
                    <td><span className={`status ${u.active ? 'status-replied' : 'status-archived'}`}>{u.active ? 'active' : 'inactive'}</span></td>
                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}</td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(u)} aria-label="Edit"><Icon name="edit" size={16} /></button>
                      {u._id !== me?.id && (
                        <button className="icon-btn danger" onClick={() => setConfirm(u)} aria-label="Delete"><Icon name="trash" size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} title={editing === 'new' ? 'New user' : 'Edit user'} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="admin-form">
          {error && editing && <div className="alert error">{error}</div>}
          <div className="field"><label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="field"><label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="field">
            <label>{editing === 'new' ? 'Password' : 'New password (leave blank to keep)'}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters" {...(editing === 'new' ? { required: true } : {})} />
          </div>
          <div className="two">
            <div className="field"><label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
              </select></div>
            <div className="field role-active">
              <label>Status</label>
              <label className="checkbox"><input type="checkbox" checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
            </div>
          </div>
          <div className="modal-foot inline">
            <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save user'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!confirm} title="Delete user?" onClose={() => setConfirm(null)}
        footer={<><button className="btn btn-light" onClick={() => setConfirm(null)}>Cancel</button><button className="btn btn-danger" onClick={() => remove(confirm._id)}>Delete</button></>}>
        {confirm && <p>Delete <strong>{confirm.name}</strong> ({roleLabel[confirm.role]})? This cannot be undone.</p>}
      </Modal>
    </div>
  );
}
