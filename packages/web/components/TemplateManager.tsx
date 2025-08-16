'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getTemplates, deleteTemplate } from '@/lib/api';
import TemplateForm from './TemplateForm';

interface FieldSchema {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface Template {
  id: number;
  name: string;
  description: string;
  fields_schema: FieldSchema[];
}

const TemplateManager = () => {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const fetchTemplates = async () => {
    if (token) {
      try {
        setLoading(true);
        const templatesData = await getTemplates(token);
        setTemplates(templatesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch templates.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [token]);

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (templateId: number) => {
    if (token && window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(templateId, token);
        fetchTemplates(); // Refresh the template list
      } catch (err) {
        setError('Failed to delete template.');
        console.error(err);
      }
    }
  };

  const handleSave = () => {
    fetchTemplates();
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={handleCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Create New Template
        </button>
      </div>

      {isModalOpen && (
        <TemplateForm
          template={selectedTemplate}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {templates.map((template) => (
            <li key={template.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(template)} className="text-sm text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button onClick={() => handleDelete(template.id)} className="text-sm text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TemplateManager;
