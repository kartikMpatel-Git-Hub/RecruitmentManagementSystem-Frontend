import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../admin/AdminLayout";
import { RecruiterLayout } from "../recruiter/RecruiterComponents";
import { ReviewerLayout } from "../reviewer/ReviewerComponents";
import {CandidateLayout} from "../candidate/CandidateComponents";
import InterviewerLayout from "../interviewer/InterviewerLayout";
import HrLayout from "../hr/HrLayout";

function Layout({ children }) {
  const { userType } = useContext(AuthContext);

  switch (userType) {
    case "admin":
      return <AdminLayout>{children}</AdminLayout>;

    case "recruiter":
      return <RecruiterLayout>{children}</RecruiterLayout>;

    case "candidate":
      return <CandidateLayout>{children}</CandidateLayout>;

    case "reviewer":
      return <ReviewerLayout>{children}</ReviewerLayout>;

    case "interviewer":
      return <InterviewerLayout>{children}</InterviewerLayout>;

    case "hr":
      return <HrLayout>{children}</HrLayout>;

    default:
      return <>{children}</>;
  }
}

export default Layout;
