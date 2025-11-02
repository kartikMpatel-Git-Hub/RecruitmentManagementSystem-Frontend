import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../admin/AdminLayout";
import { RecruiterLayout } from "../recruiter/RecruiterComponents";
import { ReviewerLayout } from "../reviewer/ReviewerComponents";

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

    default:
      return <>{children}</>;
  }
}

export default Layout;
