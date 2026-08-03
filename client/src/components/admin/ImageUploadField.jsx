import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import Icon from '../Icon.jsx';

const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function resolveUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
}

export default function ImageUploadField({ label = 'Image', value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      toast.error('Please choose a JPEG, PNG, WEBP, or AVIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await api.post('/uploads', formData);
      onChange(res.data.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="upload-field">
        <div
          className="upload-preview"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {value ? (
            <img src={resolveUrl(value)} alt="" />
          ) : (
            <span className="upload-placeholder">
              <Icon name="grid" size={18} />
            </span>
          )}
          {uploading && (
            <span className="upload-overlay">
              <span className="loader-dot"><span /><span /><span /></span>
            </span>
          )}
        </div>
        <div className="upload-actions">
          <button type="button" className="btn btn-light btn-sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="btn btn-light btn-sm" onClick={() => onChange('')} disabled={uploading}>
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
