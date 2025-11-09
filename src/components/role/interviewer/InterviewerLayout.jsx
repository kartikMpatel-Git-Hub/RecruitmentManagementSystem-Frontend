import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Sidebar from "./Sidebar";

function InterviewerLayout({ children }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default InterviewerLayout;