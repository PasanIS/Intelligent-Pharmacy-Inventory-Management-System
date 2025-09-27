import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../../api/apiService';
import type { Category } from '../../types';
import type { AxiosError } from 'axios';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void; // Callback to refresh data in the parent component
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ isOpen, onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    setMessage('');
    setMessageType('');
    try {
        const response = await getAllCategories();
        setCategories(response);
    } catch (error) {
        const axiosError = error as AxiosError;
        
        // 💡 FIX: Check the HTTP status and provide a clear message
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
            setMessage('Session Expired or Unauthorized. Please log in again.');
        } else {
            setMessage('Failed to load categories.');
        }

        setMessageType('error');
        console.error('Failed to fetch categories:', error);
    } finally {
        setIsLoading(false);
    }
};

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    if (!categoryName.trim()) {
      setMessage('Category name cannot be empty.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      await createCategory({ name: categoryName });
      setMessage(`Category '${categoryName}' added successfully!`);
      setMessageType('success');
      setCategoryName('');
      onCategoryAdded(); // Call the parent's refresh function
      fetchCategories(); // Refresh the list in the modal
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        setMessage('Category already exists.');
      } else if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        setMessage('Session Expired or Unauthorized. Please log in again.');
      } else {
        setMessage('Failed to add category.');
      }
      setMessageType('error');
      console.error('Failed to add category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id.toString());
    setEditingName(category.name);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingName.trim()) {
      setMessage('Category name cannot be empty.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      await updateCategory(parseInt(editingId!), { name: editingName });
      setMessage('Category updated successfully!');
      setMessageType('success');
      setEditingId(null);
      setEditingName('');
      onCategoryAdded(); // Call the parent's refresh function
      fetchCategories(); // Refresh the list in the modal
    } catch (error) {
     const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        setMessage('Category name already exists.');
      } else if (axiosError.response?.status === 404) {
        setMessage('Category not found.');
      } else if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        setMessage('Session Expired or Unauthorized. Please log in again.');
      } else {
        setMessage('Failed to update category.');
      }
      setMessageType('error');
      console.error('Failed to update category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteCategory(id);
      setMessage(`Category '${name}' deleted successfully!`);
      setMessageType('success');
      onCategoryAdded(); // Call the parent's refresh function
      fetchCategories(); // Refresh the list in the modal
    } catch (error) {
      setMessage('Failed to delete category.');
      setMessageType('error');
      console.error('Failed to delete category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setMessage('');
    setMessageType('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <div className="manage-categories-modal">
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newCategory">Add New Category</label>
              <Input
                id="newCategory"
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Category'}
            </Button>
          </form>
          {message && <p className={`form-message ${messageType}`}>{message}</p>}
        </Card>

        <Card title="Existing Categories" className="mt-4">
          {isLoading ? (
            <p>Loading categories...</p>
          ) : (
            <div className="categories-list">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.id} className="category-item">
                    {editingId === cat.id.toString() ? (
                      <form onSubmit={handleUpdate} className="edit-form">
                        <Input
                          type="text"
                          value={editingName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingName(e.target.value)}
                          placeholder="Category name"
                          required
                        />
                        <div className="edit-actions">
                          <Button type="submit" variant="primary">
                            Save
                          </Button>
                          <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="category-display">
                        <span className="category-name">{cat.name}</span>
                        <div className="category-actions">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleEdit(cat)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => handleDelete(cat.id, cat.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No categories found.</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default ManageCategoriesModal;
