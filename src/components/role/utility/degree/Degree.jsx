import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../admin/AdminComponents";
import DegreeList from "./DegreeList";
import DegreeForm from "./DegreeForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecruiterLayout } from "../../recruiter/RecruiterComponents";

function Degree() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [degrees, setDegrees] = useState([]); // State to store all degrees
  const [editingDegree, setEditingDegree] = useState(null); // State for editing a degree

  const addDegree = async (formData) => {
    if(!authToken)
      navigate("/login");
    if(!formData)
      return
    try {
      const response = await axios.post(
        "http://localhost:8080/degrees/",
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

  const updateDegree = async (updatedDegree) => {
    if(!authToken)
      navigate("/login");
    if(!updatedDegree)
      return
    try {
      await axios.put(
        `http://localhost:8080/degrees/${updatedDegree.degreeId}`,
        updatedDegree,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setDegrees((prev) =>
        prev.map((degree) =>
          degree.degreeId === updatedDegree.degreeId ? updatedDegree : degree
        )
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

  const deleteDegree = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    try {
      await axios.delete(`http://localhost:8080/degrees/${id}`, {
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
    if (userType !== "admin" && userType !== "recruiter") {
      navigate("/");
    }
  }, [userType]);

  const fetchDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degrees", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDegrees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  return (
      userType === "admin" ? (
      <AdminLayout>
          <DegreeForm
            addDegree={addDegree}
            updateDegree={updateDegree}
            editingDegree={editingDegree}
          />
          <DegreeList
            degrees={degrees}
            setEditingDegree={setEditingDegree}
            deleteDegree={deleteDegree}
          />
      </AdminLayout>
      ):
      userType === 'recruiter' ? (
        <RecruiterLayout>
          <DegreeForm
            addDegree={addDegree}
            updateDegree={updateDegree}
            editingDegree={editingDegree}
          />
          <DegreeList
            degrees={degrees}
            setEditingDegree={setEditingDegree}
            deleteDegree={deleteDegree}
          />
        </RecruiterLayout>
      ): null
  );
}

export default Degree;
