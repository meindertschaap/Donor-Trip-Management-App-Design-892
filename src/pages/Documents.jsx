import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiFolder, FiFile, FiDownload, FiTrash2, FiSearch, FiFilter } = FiIcons;

function DocumentCard({ document, onDelete, onDownload }) {
  const getFileIcon = (type) => {
    if (type?.includes('image')) return FiIcons.FiImage;
    if (type?.includes('pdf')) return FiIcons.FiFileText;
    if (type?.includes('video')) return FiIcons.FiVideo;
    if (type?.includes('presentation') || type?.includes('powerpoint')) return FiIcons.FiMonitor;
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <SafeIcon 
              icon={getFileIcon(document.type)} 
              className="h-5 w-5 text-primary-600" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {document.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {document.category} • {formatFileSize(document.size || 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(document.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onDownload(document)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <SafeIcon icon={FiDownload} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {document.description && (
        <p className="text-sm text-gray-600 mt-3">{document.description}</p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
          {document.category}
        </span>
        {document.version && (
          <span className="text-xs text-gray-500">v{document.version}</span>
        )}
      </div>
    </Card>
  );
}

function UploadModal({ isOpen, onClose, onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    files.forEach(file => {
      onUpload({
        name: file.name,
        type: file.type,
        size: file.size,
        category: category || 'General',
        description,
        file // In a real app, you'd upload this to cloud storage
      });
    });

    // Reset form
    setFiles([]);
    setCategory('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-lg mx-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            {files.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {files.length} file(s) selected:
                </p>
                <ul className="text-sm text-gray-600">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, images, videos, presentations
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select category</option>
              <option value="Presentations">Presentations</option>
              <option value="Stories & Photos">Stories & Photos</option>
              <option value="Visa Documents">Visa Documents</option>
              <option value="Travel Documents">Travel Documents</option>
              <option value="Meeting Materials">Meeting Materials</option>
              <option value="Reports">Reports</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description of the document(s)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={files.length === 0}>
              Upload {files.length > 0 && `(${files.length})`}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Documents() {
  const { currentTrip, documents, addDocument } = useTrip();
  const { success } = useNotification();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const tripDocuments = documents.filter(doc => doc.tripId === currentTrip?.id);

  const filteredDocuments = tripDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(tripDocuments.map(doc => doc.category))];

  const handleUpload = (documentData) => {
    addDocument({
      ...documentData,
      tripId: currentTrip?.id,
      version: 1,
      createdAt: new Date().toISOString()
    });
    success('Document uploaded successfully');
  };

  const handleDelete = (documentId) => {
    if (confirm('Are you sure you want to delete this document?')) {
      success('Document deleted successfully');
    }
  };

  const handleDownload = (document) => {
    success(`Downloading ${document.name}`);
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiFolder} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to manage documents.</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-600">Manage documents for {currentTrip.name}</p>
        </div>
        <Button
          icon={FiUpload}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Documents
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DocumentCard
                document={document}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <SafeIcon icon={FiFolder} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || categoryFilter !== 'all' ? 'No Documents Found' : 'No Documents Yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Upload your first document to get started.'
            }
          </p>
          <Button
            icon={FiUpload}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Documents
          </Button>
        </Card>
      )}

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </motion.div>
  );
}

export default Documents;