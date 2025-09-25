import { createBrowserRouter } from 'react-router';

import { AuthGate } from '@/auth-context';
import {
  Layout,
  Home,
  Signup,
  Signin,
  TopicCreate,
  TopicDetail,
} from '@/routes';

export default createBrowserRouter([
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
    ],
  },
]);
