import { createBrowserRouter } from 'react-router';

import { AuthGate } from '@/auth-context';
import {
  Setup,
  Layout,
  Home,
  Signup,
  Signin,
  TopicCreate,
  TopicDetail,
  UserDetail,
  UserSetting,
  UserUpdatePassword,
} from '@/routes';

export default createBrowserRouter([
  {
    path: '/setup',
    element: <Setup />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },
      {
        path: 'topic',
        children: [
          {
            path: 'create',
            element: (
              <AuthGate>
                <TopicCreate />
              </AuthGate>
            ),
          },
          {
            path: ':topicId',
            element: <TopicDetail />,
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: ':userId',
            element: <UserDetail />,
          },
          {
            path: 'setting',
            element: (
              <AuthGate>
                <UserSetting />
              </AuthGate>
            ),
          },
          {
            path: 'update-password',
            element: (
              <AuthGate>
                <UserUpdatePassword />
              </AuthGate>
            ),
          },
        ],
      },
    ],
  },
]);
