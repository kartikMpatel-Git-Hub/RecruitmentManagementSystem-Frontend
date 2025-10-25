import { Routes, Route } from 'react-router-dom';
import Register from './components/Authentication/Register';
import NotFound from './components/utility/NotFound';
import Login from './components/Authentication/Login';
import Logout from './components/Authentication/Logout';
import {AdminProfile,Dashboard} from './components/role/admin/AdminComponents';
import {RecruiterDashboard,RecruiterProfile} from './components/role/recruiter/RecruiterComponents';
import {Home,CandidateProfile} from './components/role/candidate/CandidateComponents';
import { Degree ,University,User,Candidate,Skill,SingleUserProfile,SingleCandidateProfile} from './components/role/utility/UtilityComponents';

function App() {
  return (
    <Routes>
      
      <Route path='/candidate'>
        <Route path="" element={<Home />} />
        <Route path='profile' element={<CandidateProfile />} />
      </Route>

      <Route path='/admin'>
        <Route path=""  element={<Dashboard/>}/>
        <Route path="degrees" element={<Degree />} />
        <Route path="universities" element={<University />} />

        <Route path="users">
          <Route path="" element={<User />} />
          <Route path=":id" element={<SingleUserProfile />} />
        </Route>
        
        <Route path="profile" element={<AdminProfile />} />

        <Route path="candidates">
          <Route path="" element={<Candidate />} />
          <Route path=":id" element={<SingleCandidateProfile />} />
        </Route>

        <Route path="skills" element={<Skill />} />
      </Route>

      <Route path='/recruiter'>
        <Route path=""  element={<RecruiterDashboard/>}/>
        <Route path="degrees" element={<Degree />} />
        <Route path="universities" element={<University />} />

        <Route path="profile" element={<RecruiterProfile />} />


        <Route path="candidates">
          <Route path="" element={<Candidate />} />
          <Route path=":id" element={<SingleCandidateProfile />} />
        </Route>

        <Route path="skills" element={<Skill />} />
      </Route>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;