import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';
import { ChannelProjectsPage } from '@/pages/dashboard/ChannelProjectsPage';
import { AnimationContainer } from '@/components/organisms';
import { DashboardLayout } from '@/pages/layouts/DashboardLayout';
import { EditorLayout } from '@/pages/layouts/EditorLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'channels/:channelId',
        element: <ChannelProjectsPage />,
      },
    ],
  },
  {
    path: '/channels/:channelId/editor/:projectId',
    element: <EditorLayout />,
    children: [
      {
        index: true,
        element: <AnimationContainer />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
