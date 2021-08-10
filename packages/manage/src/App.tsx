import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import userStore from '@/store/user';
import Authorized from '@/components/Authorized';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import User from './pages/user';
import Topic from './pages/topic';
import TopicDetail from './pages/topic/[id]';

function App() {
  useEffect(() => {
    userStore.dispatch('getUserInfo');
  }, []);

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Redirect path="/" to="/dashboard" exact />
          <Route path="/dashboard">
            <Authorized>
              <Dashboard />
            </Authorized>
          </Route>
          <Route path="/user">
            <Authorized>
              <User />
            </Authorized>
          </Route>
          <Route path="/topic" exact>
            <Authorized>
              <Topic />
            </Authorized>
          </Route>
          <Route path="/topic/detail">
            <Authorized>
              <TopicDetail />
            </Authorized>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
