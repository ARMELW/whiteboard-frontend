import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage';
import { ChannelProjectsPage } from '@/pages/dashboard/ChannelProjectsPage';
import { AnimationContainer } from '@/components/organisms';
import { DashboardLayout } from '@/pages/layouts/DashboardLayout';
import { EditorLayout } from '@/pages/layouts/EditorLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { PricingPage } from '@/pages/pricing/PricingPage';
import { ProtectedRoute } from '@/app/auth/components';
import { SubscriptionFeaturesDemo } from '@/pages/demo/SubscriptionFeaturesDemo';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/demo/subscription',
    element: <SubscriptionFeaturesDemo />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <EditorLayout />
      </ProtectedRoute>
    ),
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
