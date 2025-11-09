import { Routes, Route } from "react-router-dom";
import Register from "./components/Authentication/Register";
import NotFound from "./components/utility/NotFound";
import Login from "./components/Authentication/Login";
import Logout from "./components/Authentication/Logout";
import {
  AdminProfile,
  Dashboard,
} from "./components/role/admin/AdminComponents";
import {
  RecruiterDashboard,
  RecruiterProfile,
} from "./components/role/recruiter/RecruiterComponents";
import {
  Home,
  CandidateProfile,
  CandidatePositions,
  CandidateSinglePosition,
} from "./components/role/candidate/CandidateComponents";
import {
  Degree,
  DegreeList,
  University,
  UniversityList,
  User,
  Candidate,
  Skill,
  SkillList,
  SingleUserProfile,
  SingleCandidateProfile,
  Position,
  PositionList,
  SinglePosition,
  PositionApplications,
  PositionShortlistedApplications,
  AllApplications,
  AllShortlistedApplications,
  Interview,
} from "./components/role/utility/UtilityComponents";
import {
  ReviewerDashboard,
  ReviewerProfile,
} from "./components/role/reviewer/ReviewerComponents";
import InterviewerDashboard from "./components/role/interviewer/InterviewerDashboard";
import InterviewerProfile from "./components/role/interviewer/InterviewerProfile";

function App() {
  return (
    <Routes>
      <Route path="/candidate">
        <Route path="" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="positions" element={<CandidatePositions />} />
        <Route path="positions/:id" element={<CandidateSinglePosition />} />
      </Route>

      <Route path="/admin">
        <Route path="" element={<Dashboard />} />

        <Route path="degrees">
          <Route path="" element={<DegreeList />} />
          <Route path="new" element={<Degree />} />
        </Route>

        <Route path="universities">
          <Route path="" element={<UniversityList />} />
          <Route path="new" element={<University />} />
        </Route>

        <Route path="users">
          <Route path="" element={<User />} />
          <Route path=":id" element={<SingleUserProfile />} />
        </Route>

        <Route path="profile" element={<AdminProfile />} />

        <Route path="candidates">
          <Route path="" element={<Candidate />} />
          <Route path=":id" element={<SingleCandidateProfile />} />
        </Route>

        <Route path="skills">
          <Route path="" element={<SkillList />} />
          <Route path="new" element={<Skill />} />
        </Route>

        <Route path="applications">
          <Route path="" element={<AllApplications />} />
          <Route path="shortlists" element={<AllShortlistedApplications />} />
        </Route>
        
        <Route path="positions">
          <Route path="" element={<PositionList />} />
          <Route path="new" element={<Position />} />
          <Route path=":id" element={<SinglePosition />} />
          <Route
            path=":positionId/applications"
            element={<PositionApplications />}
          />
          <Route
            path=":positionId/applications/shortlist"
            element={<PositionShortlistedApplications />}
          />
        </Route>
      </Route>

      <Route path="/recruiter">
        <Route path="" element={<RecruiterDashboard />} />

        <Route path="degrees">
          <Route path="" element={<DegreeList />} />
          <Route path="new" element={<Degree />} />
        </Route>

        <Route path="universities">
          <Route path="" element={<UniversityList />} />
          <Route path="new" element={<University />} />
        </Route>

        <Route path="profile" element={<RecruiterProfile />} />

        <Route path="candidates">
          <Route path="" element={<Candidate />} />
          <Route path=":id" element={<SingleCandidateProfile />} />
        </Route>

        <Route path="skills">
          <Route path="" element={<SkillList />} />
          <Route path="new" element={<Skill />} />
        </Route>

        <Route path="applications">
          <Route path="" element={<AllApplications />} />
          <Route path="shortlists" element={<AllShortlistedApplications />} />
        </Route>

        <Route path="positions">
          <Route path="" element={<PositionList />} />
          <Route path="new" element={<Position />} />
          <Route path=":id" element={<SinglePosition />} />
          <Route
            path=":positionId/applications"
            element={<PositionApplications />}
          />
          <Route
            path=":positionId/applications/shortlist"
            element={<PositionShortlistedApplications />}
          />
        </Route>
      </Route>

      <Route path="/reviewer">
        <Route path="" element={<ReviewerDashboard />} />
        <Route path="profile" element={<ReviewerProfile />} />

        <Route path="candidates/:id" element={<SingleCandidateProfile />} />

        <Route path="applications">
          <Route path="" element={<AllApplications />} />
          <Route path="shortlists" element={<AllShortlistedApplications />} />
        </Route>
        <Route path="positions">
          <Route path="" element={<PositionList />} />
          <Route path=":id" element={<SinglePosition />} />

          <Route
            path=":positionId/applications"
            element={<PositionApplications />}
          />
          <Route
            path=":positionId/applications/shortlist"
            element={<PositionShortlistedApplications />}
          />
        </Route>
      </Route>
      
      <Route path="/interviewer">
        <Route path="" element={<InterviewerDashboard />} />
        <Route path="profile" element={<InterviewerProfile />} />

        <Route path="candidates/:id" element={<SingleCandidateProfile />} />

        <Route path="interviews" element={<Interview />} />
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
