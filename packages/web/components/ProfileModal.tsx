'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Contact {
  first_name: string;
  last_name: string;
  email: string;
  personal_email?: string;
  phone_number?: string;
  secondary_phone_number?: string;
  middle_name?: string;
  preferred_name?: string;
  postal_address?: string;
  gender?: string;
  membership_id?: string;
  organizational_unit?: string;
  region?: string;
  usi_number?: string;
  preferred_contact_method?: string;
  blue_card_number?: string;
  license_number?: string;
}

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { token } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/users/me/contact', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContact(response.data);
      } catch (err) {
        setError('Failed to fetch contact details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [token]);

  const renderDetail = (label: string, value: string | undefined | null) => {
    if (!value) return null;
    return (
      <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center" onClick={onClose}>
      <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="mt-4 px-2 py-3 text-left max-h-[70vh] overflow-y-auto">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {contact && (
              <dl>
                {renderDetail('Full Name', `${contact.first_name} ${contact.middle_name || ''} ${contact.last_name}`.replace(/\s+/g, ' ').trim())}
                {renderDetail('Preferred Name', contact.preferred_name)}
                {renderDetail('Email', contact.email)}
                {renderDetail('Personal Email', contact.personal_email)}
                {renderDetail('Phone Number', contact.phone_number)}
                {renderDetail('Secondary Phone', contact.secondary_phone_number)}
                {renderDetail('Gender', contact.gender)}
                {renderDetail('Postal Address', contact.postal_address)}
                {renderDetail('Membership ID', contact.membership_id)}
                {renderDetail('Organizational Unit', contact.organizational_unit)}
                {renderDetail('Region', contact.region)}
                {renderDetail('USI Number', contact.usi_number)}
                {renderDetail('Blue Card Number', contact.blue_card_number)}
                {renderDetail('License Number', contact.license_number)}
                {renderDetail('Preferred Contact', contact.preferred_contact_method)}
              </dl>
            )}
          </div>
          <div className="items-center px-4 py-3 border-t mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}