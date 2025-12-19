'use client';

import { SessionProvider } from 'next-auth/react';

import Login from '@/components/pages/admin/Login';

const Admin = () => (
  <SessionProvider>
    <Login />
  </SessionProvider>
);
export default Admin;
