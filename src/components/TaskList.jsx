import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { 
  Search, Grid, List, ArrowUpDown, SlidersHorizontal, 
  ClipboardX, Plus 
} from 'lucide-react';

export default function TaskList({
  tasks,
  categories,
  selectedCategory,
  onToggleComplete,
  onDelete,
  onEdit,
  onToggleSubtask,
  onOpenAddTaskModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, low, medium, high
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, created, alphabet
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // 1. Filter Tasks
  const filteredTasks = tasks.filter(task => {
    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }
    
    // Status filter
    if (statusFilter === 'active' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Search query filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  // 2. Sort Tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'alphabet') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <div className="task-list-section">
      {/* Search and Settings Toolbar */}
      <div className="toolbar-container">
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          {/* Status Filter */}
          <div className="filter-group">
            <button
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Priority Filter */}
          <div className="select-wrapper">
            <SlidersHorizontal size={14} className="select-icon" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="toolbar-select"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="select-wrapper">
            <ArrowUpDown size={14} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="toolbar-select"
              aria-label="Sort tasks by"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="created">Date Created</option>
              <option value="alphabet">Alphabetical</option>
            </select>
          </div>

          {/* View Mode Grid/List toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks listing area */}
      {sortedTasks.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-icon-wrapper">
            <ClipboardX size={48} className="empty-icon" />
          </div>
          <h3>No tasks match your filters</h3>
          <p>Try clearing filters or add a new task to get started!</p>
          <button className="empty-add-btn" onClick={onOpenAddTaskModal}>
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className={`tasks-container-grid ${viewMode}`}>
          {sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              categories={categories}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleSubtask={onToggleSubtask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
