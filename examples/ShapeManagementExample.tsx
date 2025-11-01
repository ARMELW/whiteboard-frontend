/**
 * Shape Management Example Component
 * 
 * This component demonstrates how to use the shapes module for:
 * - Uploading SVG shapes with metadata
 * - Listing shapes with filters and pagination
 * - Viewing shape details
 * - Updating shape metadata
 * - Deleting shapes
 * - Viewing shape statistics
 */

import React, { useState } from 'react';
import {
  useShapes,
  useShapesActions,
  type ShapeCategory,
  type ShapeAsset
} from '@/app/shapes';

const CATEGORIES: { value: ShapeCategory; label: string }[] = [
  { value: 'basic', label: 'Basic Shapes' },
  { value: 'arrow', label: 'Arrows' },
  { value: 'callout', label: 'Callouts' },
  { value: 'banner', label: 'Banners' },
  { value: 'icon', label: 'Icons' },
  { value: 'decorative', label: 'Decorative' },
  { value: 'other', label: 'Other' }
];

export function ShapeManagementExample() {
  // State for upload form
  const [file, setFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ShapeCategory>('other');
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // State for filters
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState<ShapeCategory | ''>('');
  const [sortBy, setSortBy] = useState<'name' | 'uploadDate' | 'size' | 'usageCount'>('uploadDate');
  const [page, setPage] = useState(1);

  // State for editing
  const [editingShape, setEditingShape] = useState<ShapeAsset | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);

  // Hooks
  const { shapes, total, loading } = useShapes({
    filter: filterText || undefined,
    category: filterCategory || undefined,
    sortBy,
    sortOrder: 'desc',
    page,
    limit: 12
  });

  const {
    uploadShape,
    updateShape,
    deleteShape,
    getShapeStats,
    isUploading,
    isUpdating,
    isDeleting,
    isLoadingStats
  } = useShapesActions();

  const stats = getShapeStats();

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'image/svg+xml') {
        setFile(selectedFile);
        if (!uploadName) {
          setUploadName(selectedFile.name.replace('.svg', ''));
        }
      } else {
        alert('Please select an SVG file');
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput && !uploadTags.includes(tagInput)) {
      setUploadTags([...uploadTags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setUploadTags(uploadTags.filter(t => t !== tag));
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadShape(file, {
        name: uploadName || file.name,
        category: uploadCategory,
        tags: uploadTags
      });

      // Reset form
      setFile(null);
      setUploadName('');
      setUploadCategory('other');
      setUploadTags([]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleStartEdit = (shape: ShapeAsset) => {
    setEditingShape(shape);
    setEditName(shape.name);
    setEditTags(shape.tags);
  };

  const handleSaveEdit = async () => {
    if (!editingShape) return;

    try {
      await updateShape(editingShape.id, {
        name: editName,
        tags: editTags
      });
      setEditingShape(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (shapeId: string, shapeName: string) => {
    if (confirm(`Delete "${shapeName}"?`)) {
      try {
        await deleteShape(shapeId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Shape Management System</h1>

      {/* Statistics Section */}
      <div style={{
        background: '#f5f5f5',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>Statistics</h2>
        {isLoadingStats ? (
          <p>Loading statistics...</p>
        ) : stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div>
              <strong>Total Shapes:</strong> {stats.totalShapes}
            </div>
            <div>
              <strong>Total Size:</strong> {stats.totalSizeMB} MB
            </div>
            <div>
              <strong>Basic:</strong> {stats.shapesByCategory.basic}
            </div>
            <div>
              <strong>Icons:</strong> {stats.shapesByCategory.icon}
            </div>
          </div>
        ) : null}
      </div>

      {/* Upload Section */}
      <div style={{
        border: '2px dashed #ccc',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>Upload New Shape</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <strong>SVG File:</strong>
            <input
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileChange}
              disabled={isUploading}
              style={{ marginLeft: '1rem' }}
            />
          </label>
        </div>

        {file && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <strong>Name:</strong>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Shape name"
                  style={{ marginLeft: '1rem', padding: '0.5rem', width: '300px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <strong>Category:</strong>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as ShapeCategory)}
                  style={{ marginLeft: '1rem', padding: '0.5rem' }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Tags:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {uploadTags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag"
                  style={{ padding: '0.5rem', marginRight: '0.5rem' }}
                />
                <button
                  onClick={handleAddTag}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Add Tag
                </button>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                padding: '0.75rem 2rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload Shape'}
            </button>
          </>
        )}
      </div>

      {/* Filters Section */}
      <div style={{
        background: '#f9f9f9',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>Filters</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label>
              <strong>Search:</strong>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter by name..."
                style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
              />
            </label>
          </div>

          <div>
            <label>
              <strong>Category:</strong>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as ShapeCategory | '')}
                style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              <strong>Sort By:</strong>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
              >
                <option value="uploadDate">Upload Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="usageCount">Usage Count</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Shapes Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Shapes ({total})</h2>
          <div>
            Page {page} of {Math.ceil(total / 12)}
          </div>
        </div>

        {loading ? (
          <div>Loading shapes...</div>
        ) : shapes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            No shapes found. Upload one to get started!
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {shapes.map(shape => (
                <div
                  key={shape.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: 'white'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '150px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                  }}>
                    <img
                      src={shape.thumbnailUrl || shape.url}
                      alt={shape.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{shape.name}</h4>
                  
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                    <div><strong>Category:</strong> {shape.category}</div>
                    <div><strong>Size:</strong> {(shape.size / 1024).toFixed(2)} KB</div>
                    {shape.width && shape.height && (
                      <div><strong>Dimensions:</strong> {shape.width} × {shape.height}</div>
                    )}
                    <div><strong>Used:</strong> {shape.usageCount} times</div>
                  </div>

                  {shape.tags.length > 0 && (
                    <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                      {shape.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            display: 'inline-block',
                            background: '#e9ecef',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '3px',
                            marginRight: '0.25rem',
                            marginBottom: '0.25rem'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleStartEdit(shape)}
                      disabled={isUpdating || isDeleting}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(shape.id, shape.name)}
                      disabled={isUpdating || isDeleting}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Previous
                </button>
                <span style={{ padding: '0.5rem 1rem' }}>
                  Page {page} of {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage(Math.min(Math.ceil(total / 12), page + 1))}
                  disabled={page >= Math.ceil(total / 12)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingShape && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>Edit Shape</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                <strong>Name:</strong>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.5rem',
                    marginTop: '0.25rem'
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Tags:</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {editTags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-block',
                      background: '#007bff',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      marginRight: '0.5rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => setEditTags(editTags.filter(t => t !== tag))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        marginLeft: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingShape(null)}
                disabled={isUpdating}
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer'
                }}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShapeManagementExample;
