import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import DegreeList from "./DegreeList";
import DegreeForm from "./DegreeForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Degree() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [degrees, setDegrees] = useState([]); // State to store all degrees
  const [editingDegree, setEditingDegree] = useState(null); // State for editing a degree

  // Add a new degree
  const addDegree = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/degree/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setDegrees((prev) => [...prev, response.data]);
      toast.success("Degree Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Degree Adding failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error adding degree:", error);
    }
    setEditingDegree(null); 
  };

  // Update an existing degree
  const updateDegree = async (updatedDegree) => {
    setDegrees((prev) =>
      prev.map((degree) =>
        degree.degreeId === updatedDegree.degreeId ? updatedDegree : degree
      )
    );
    try {
      await axios.put(
        `http://localhost:8080/degree/${updatedDegree.degreeId}`,
        updatedDegree,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Degree Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Degree Updating failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error updating degree:", error);
    }
    setEditingDegree(null); // Clear editing state
  };

  // Delete a degree
  const deleteDegree = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/degree/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Degree Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Degree Deleting failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error deleting degree:", error);
    }
    setDegrees((prev) => prev.filter((degree) => degree.degreeId !== id));
  };

  useEffect(() => {
    if (userType !== "admin") {
      navigate("/home");
    }
  }, [userType]);

  const fetchDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degree/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDegrees(response.data || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-mono">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Degree Form */}
            <DegreeForm
              addDegree={addDegree}
              updateDegree={updateDegree}
              editingDegree={editingDegree}
            />

            {/* Degree List */}
            <DegreeList
              degrees={degrees}
              setEditingDegree={setEditingDegree}
              deleteDegree={deleteDegree}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Degree;
