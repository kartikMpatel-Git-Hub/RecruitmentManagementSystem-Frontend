import { Routes, Route } from 'react-router-dom';
import Register from './components/Authentication/Register';
import NotFound from './components/utility/NotFound';
import Login from './components/Authentication/Login';
import Home from './components/pages/Home';
import Logout from './components/Authentication/Logout';
import Profile from './components/pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;