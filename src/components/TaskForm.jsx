import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

export default function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories, 
  editingTask 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Synchronize fields when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority);
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory(categories[0]?.id || 'personal');
      setDueDate('');
      setPriority('medium');
      setSubtasks([]);
    }
  }, [editingTask, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate,
      priority,
      subtasks
    });
    
    // Clear state
    setTitle('');
    setDescription('');
    setCategory(categories[0]?.id || 'personal');
    setDueDate('');
    setPriority('medium');
    setSubtasks([]);
    onClose();
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;

    const newSubtask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      text: newSubtaskText.trim(),
      completed: false
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(sub => sub.id !== id));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">Task Title *</label>
            <input
              type="text"
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design app interface"
              className="form-input"
              required
              maxLength={60}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="form-textarea"
              maxLength={500}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-category" className="form-label">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select priority-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due" className="form-label">
              <Calendar size={14} style={{ marginRight: '6px' }} />
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              id="task-due"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtasks Checklist</label>
            <div className="subtask-input-wrapper">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                className="form-input subtask-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={handleAddSubtask}
                className="add-subtask-btn"
                aria-label="Add subtask"
              >
                <Plus size={16} />
              </button>
            </div>

            {subtasks.length > 0 && (
              <ul className="form-subtask-list custom-scroll">
                {subtasks.map((sub) => (
                  <li key={sub.id} className="form-subtask-item">
                    <span className="subtask-bullet">•</span>
                    <span className="form-subtask-text">{sub.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="delete-subtask-btn"
                      aria-label="Delete subtask"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
