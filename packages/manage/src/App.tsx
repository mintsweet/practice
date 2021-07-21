import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Authorized from '@/components/Authorized';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Authorized>
              <Dashboard />
            </Authorized>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
