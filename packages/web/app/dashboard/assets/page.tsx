'use client';

import React from 'react';
import withAuth from '../../../components/withAuth';
import AssetsTable from '../../../components/AssetsTable';

const AssetsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <AssetsTable />
    </div>
  );
};

export default withAuth(AssetsPage);
