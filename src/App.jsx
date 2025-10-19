import { Routes, Route } from 'react-router-dom';
import Register from './components/Authentication/Register';
import NotFound from './components/utility/NotFound';
import Login from './components/Authentication/Login';
import Home from './components/pages/Home';
import Logout from './components/Authentication/Logout';
import Profile from './components/candidate/Profile';
import Dashboard from './components/admin/Dashboard';
import Degree from './components/admin/Degree/Degree';
import User from './components/admin/users/User';
import Skill from './components/admin/Skill/Skill';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/degrees" element={<Degree />} />
      <Route path="/admin/users" element={<User />} />
      <Route path="/admin/skills" element={<Skill />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;