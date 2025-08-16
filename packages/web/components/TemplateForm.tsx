'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createTemplate, updateTemplate } from '@/lib/api';
import { PlusCircle, Trash2 } from 'lucide-react';

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

interface TemplateFormProps {
  template: Template | null;
  onSave: () => void;
  onCancel: () => void;
}

const fieldTypes = ['text', 'textarea', 'number', 'date', 'datetime', 'checkbox', 'select'];

const TemplateForm = ({ template, onSave, onCancel }: TemplateFormProps) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setFields(template.fields_schema);
    } else {
      setName('');
      setDescription('');
      setFields([]);
    }
  }, [template]);

  const handleFieldChange = (index: number, field: keyof FieldSchema, value: any) => {
    const newFields = [...fields];
    (newFields[index] as any)[field] = value;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    const templateData = { name, description, fields_schema: fields };

    try {
      if (template) {
        await updateTemplate(template.id, templateData, token);
      } else {
        await createTemplate(templateData, token);
      }
      onSave();
    } catch (err) {
      setError('Failed to save template.');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{template ? 'Edit' : 'Create'} Template</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <h3 className="text-lg font-semibold mb-4 border-t pt-4">Custom Fields</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className="p-4 border rounded-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Field Name (no spaces)</label>
                    <input type="text" value={field.name} onChange={(e) => handleFieldChange(index, 'name', e.target.value)} className="mt-1 w-full text-sm p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Field Label</label>
                    <input type="text" value={field.label} onChange={(e) => handleFieldChange(index, 'label', e.target.value)} className="mt-1 w-full text-sm p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Field Type</label>
                    <select value={field.type} onChange={(e) => handleFieldChange(index, 'type', e.target.value)} className="mt-1 w-full text-sm p-2 border rounded">
                      {fieldTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  {field.type === 'select' && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600">Options (comma-separated)</label>
                      <textarea
                        value={field.options ? field.options.join(', ') : ''}
                        onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                        rows={2}
                        className="mt-1 w-full text-sm p-2 border rounded"
                        placeholder="e.g., Option 1, Option 2, Option 3"
                      />
                    </div>
                  )}
                  <div className="flex items-end justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" checked={field.required} onChange={(e) => handleFieldChange(index, 'required', e.target.checked)} className="mr-2" />
                      <span className="text-xs text-gray-600">Required</span>
                    </label>
                    <button type="button" onClick={() => removeField(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addField} className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
            <PlusCircle size={18} className="mr-2" />
            Add Field
          </button>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;
