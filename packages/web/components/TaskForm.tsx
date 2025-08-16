
'use client';

import { useState, useEffect } from 'react';
import { getTemplates } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  template_id?: number | null;
  custom_data?: { [key: string]: any };
}

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

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, onSave, onCancel }: TaskFormProps) => {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
    template_id: null,
    custom_data: {},
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      if (token) {
        try {
          const templatesData = await getTemplates(token);
          setTemplates(templatesData);
        } catch (error) {
          console.error("Failed to fetch templates", error);
        }
      }
    };
    fetchTemplates();
  }, [token]);

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      });
      if (task.template_id) {
        const matchingTemplate = templates.find(t => t.id === task.template_id);
        setSelectedTemplate(matchingTemplate || null);
      }
    }
  }, [task, templates]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === parseInt(templateId)) || null;
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      template_id: template ? template.id : null,
      custom_data: {},
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      custom_data: {
        ...prev.custom_data,
        [name]: isCheckbox ? checked : value,
      },
    }));
  };

  // helper to set combined datetime value from separate date and time inputs
  const handleCustomDateTimeChange = (name: string, datePart: string, timePart: string) => {
    const combined = datePart && timePart ? `${datePart}T${timePart}` : '';
    setFormData(prev => ({
      ...prev,
      custom_data: {
        ...prev.custom_data,
        [name]: combined,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderField = (field: FieldSchema) => {
    const value = formData.custom_data?.[field.name] ?? '';

    switch (field.type) {
      case 'text':
      case 'number':
        return <input type={field.type} name={field.name} value={value} onChange={handleCustomFieldChange} required={field.required} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />;
      case 'date':
        return <input type="date" name={field.name} value={value ? new Date(value).toISOString().split('T')[0] : ''} onChange={handleCustomFieldChange} required={field.required} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />;
      case 'datetime':
        // Format value for datetime-local input (YYYY-MM-DDTHH:mm)
        const formattedDatetime = value ? new Date(value).toISOString().slice(0, 16) : '';
        return <input type="datetime-local" name={field.name} value={formattedDatetime} onChange={handleCustomFieldChange} required={field.required} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />;
      case 'datetime': {
        // render separate date and time inputs for better UX
        const raw = value || '';
        let datePart = '';
        let timePart = '';
        if (raw) {
          const d = new Date(raw);
          if (!isNaN(d.getTime())) {
            const pad = (n: number) => n.toString().padStart(2, '0');
            datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
          }
        }
        return (
          <div className="mt-1 flex space-x-2">
            <input
              type="date"
              name={`${field.name}__date`}
              value={datePart}
              onChange={(e) => handleCustomDateTimeChange(field.name, e.target.value, timePart)}
              required={field.required}
              className="block w-1/2 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="time"
              name={`${field.name}__time`}
              value={timePart}
              onChange={(e) => handleCustomDateTimeChange(field.name, datePart, e.target.value)}
              required={field.required}
              className="block w-1/2 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        );
      }
      case 'textarea':
        return <textarea name={field.name} value={value} onChange={handleCustomFieldChange} required={field.required} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />;
      case 'checkbox':
        return <input type="checkbox" name={field.name} checked={!!value} onChange={handleCustomFieldChange} className="rounded" />;
      case 'select':
        return (
          <select name={field.name} value={value} onChange={handleCustomFieldChange} required={field.required} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select...</option>
            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="template_id" className="block text-sm font-medium text-gray-700">Task Type (Template)</label>
            <select
              name="template_id"
              id="template_id"
              value={formData.template_id || ''}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={!!task} // Disable if editing a task
            >
              <option value="">None</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Due Date</label>
            <input type="date" name="due_date" id="due_date" value={formData.due_date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {selectedTemplate && (
            <div className="my-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">{selectedTemplate.name} Details</h3>
              {selectedTemplate.fields_schema.map(field => (
                <div key={field.name} className="mb-4">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
