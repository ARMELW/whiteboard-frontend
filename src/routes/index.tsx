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
import { LandingPage } from '@/pages/LandingPage';
import { ProtectedRoute } from '@/app/auth/components';
import { SubscriptionFeaturesDemo } from '@/pages/demo/SubscriptionFeaturesDemo';
import MultiCameraDemo from '@/pages/demo/MultiCameraDemo';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
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
    path: '/demo/multi-camera',
    element: <MultiCameraDemo />,
  },
  {
    path: '/dashboard',
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
