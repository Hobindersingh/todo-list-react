import React, { useState } from 'react';
import { 
  Plus, Trash2, Download, Upload, Sun, Moon, 
  Layers, Sparkles 
} from 'lucide-react';

export default function Sidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  onAddCategory,
  onDeleteCategory,
  onExportBackup,
  onImportBackup,
  theme,
  toggleTheme
}) {
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [showCatForm, setShowCatForm] = useState(false);

  const colors = [
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#3b82f6'  // Blue
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    // Check if category already exists
    if (categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      alert('Category already exists!');
      return;
    }

    onAddCategory({
      id: newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName.trim(),
      color: newCatColor
    });
    setNewCatName('');
    setShowCatForm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportBackup(file);
    }
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Sparkles className="logo-spark" size={22} />
        </div>
        <span className="brand-name">Zenflow</span>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Navigation</h3>
        <ul className="category-list">
          <li 
            className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <Layers size={16} />
            <span>All Tasks</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-section flex-grow">
        <div className="section-header">
          <h3 className="section-title">Categories</h3>
          <button 
            className="add-cat-btn"
            onClick={() => setShowCatForm(!showCatForm)}
            aria-label="Add new category"
            title="Create Custom Category"
          >
            <Plus size={16} />
          </button>
        </div>

        {showCatForm && (
          <form onSubmit={handleSubmit} className="new-category-form">
            <input
              type="text"
              placeholder="Category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="new-cat-input"
              maxLength={15}
              required
              autoFocus
            />
            <div className="color-picker-grid">
              {colors.map(color => (
                <button
                  type="button"
                  key={color}
                  className={`color-dot ${newCatColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCatColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <div className="new-cat-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowCatForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Add
              </button>
            </div>
          </form>
        )}

        <ul className="category-list custom-scroll">
          {categories.map(cat => {
            // Skip default categories from deleting, but display them
            const isDefault = ['personal', 'work', 'shopping', 'health'].includes(cat.id);
            
            return (
              <li
                key={cat.id}
                className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span 
                  className="category-dot" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span className="category-name-text">{cat.name}</span>
                {!isDefault && (
                  <button
                    className="delete-cat-item-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete category "${cat.name}"? Tasks in this category will be re-assigned to "Personal".`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                    aria-label={`Delete category ${cat.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <>
              <Sun size={16} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <div className="data-actions">
          <button className="data-btn export" onClick={onExportBackup} title="Export backup to JSON">
            <Download size={14} />
            <span>Export</span>
          </button>
          
          <label className="data-btn import" title="Import backup from JSON">
            <Upload size={14} />
            <span>Import</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
