import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

function CandidateLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="RecruitmentMS" showBackButton={true} />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default CandidateLayout;
