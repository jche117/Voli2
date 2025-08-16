
'use client';

import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import withAuth from '@/components/withAuth';
import TaskForm from '@/components/TaskForm';
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  template_id?: number | null;
  custom_data?: { [key: string]: any };
}

const TasksPage = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    if (token) {
      try {
        setLoading(true);
        const tasksData = await getTasks(token);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: number) => {
    if (token && window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId, token);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task.');
      }
    }
  };

  const handleSave = async (taskData: any) => {
    if (token) {
      try {
        if (selectedTask) {
          await updateTask(selectedTask.id, taskData, token);
        } else {
          await createTask(taskData, token);
        }
        fetchTasks();
        setIsModalOpen(false);
        setSelectedTask(null);
      } catch (err) {
        setError('Failed to save task.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div>
          {user?.roles.includes('administrator') && (
            <Link href="/admin/templates" className="bg-gray-600 text-white px-4 py-2 rounded-md mr-4">
              Manage Templates
            </Link>
          )}
          <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Create Task
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TaskForm
          task={selectedTask}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 my-2 rounded-md shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-gray-600">{task.description}</p>
                {task.custom_data && Object.keys(task.custom_data).length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <h4 className="text-sm font-semibold text-gray-500">Additional Details</h4>
                    <dl className="text-xs text-gray-600">
                      {Object.entries(task.custom_data).map(([key, value]) => (
                        <div key={key} className="flex">
                          <dt className="font-medium capitalize w-32">{key.replace(/_/g, ' ')}:</dt>
                          <dd>{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(task)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(task.id)} className="text-red-500">Delete</button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className={`px-2 py-1 text-sm rounded-full ${
                task.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                task.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                task.status === 'completed' ? 'bg-green-200 text-green-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {task.status}
              </span>
              <span className="text-gray-500 text-sm">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAuth(TasksPage);
