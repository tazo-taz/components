import React from 'react';
import { Outlet, Route, Routes, useRoutes } from 'react-router-dom';

// Pages
import AdminPanelTable from './pages/adminPanelTable';
import Input from './pages/input';
import Post from './pages/test/post';

const defRoutes = [
  { path: '/adminpaneltable', element: <AdminPanelTable /> },
  { path: '/input', element: <Input /> },
  { path: '/test/post', element: <Post /> },
  { path: '*', element: <h1>This is error page or you are not allowed</h1> },
];

export default function App() {
  const defaultRoutes = useRoutes(defRoutes);
  return <>{defaultRoutes}</>;
}
