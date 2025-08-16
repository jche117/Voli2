"use client";

import React from 'react';
import Link from 'next/link';

export default function OrganisationSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Organisation Settings</h1>
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">Back to dashboard</Link>
          </div>

          <p className="mt-4 text-sm text-gray-600">Manage organisation-level configuration. This page is a placeholder — add fields for organisation name, contact, address, and other settings here.</p>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-medium">Organisation Details</h2>
              <div className="mt-2 text-sm text-gray-700">Name, address, primary contact, and other core metadata will go here.</div>
            </div>

            <div className="p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-medium">Sign-in & Access</h2>
              <div className="mt-2 text-sm text-gray-700">Organisation-level access controls and policies can be configured here.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
