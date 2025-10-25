import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../admin/AdminComponents";
import UniversityForm from "./UniversityForm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UniversityList from "./UniversityList";
import { RecruiterLayout } from "../../recruiter/RecruiterComponents";

function University() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [universities, setUniversities] = useState([]); // State to store all degrees
  const [editingUniversity, setEditingUniversity] = useState(null); // State for editing a degree
  const [errorMessage, setErrorMessage] = useState("");

  const addUniversity = async (formData) => {
    if(!authToken)
      navigate("/login");
    if (!formData) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/universities/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUniversities((prev) => [...prev, response.data]);
      toast.success("University Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      setErrorMessage(error.response.data.university);
      toast.error(
        error?.response?.data?.message || "University Adding failed!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Error adding University:", error);
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
    setEditingUniversity(null);
  };

  // Update an existing degree
  const updateUniversity = async (updatedUniversity) => {
    if(!authToken)
      navigate("/login");
    if (!updatedUniversity || !updatedUniversity.universityId) {
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/universities/${updatedUniversity.universityId}`,
        updatedUniversity,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("university Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUniversities((prev) =>
        prev.map((university) =>
          university.universityId === updatedUniversity.universityId
            ? updatedUniversity
            : university
        )
      );
    } catch (error) {
      setErrorMessage(error.response.data.university);
      toast.error(
        error?.response?.data?.message || "university Updating failed!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
    setTimeout(() => {
      setErrorMessage(null);
    }, 2000);
    setEditingUniversity(null);
  };

  const deleteUniversity = async (id) => {
    if(!authToken)
      navigate("/login");
    if (!id) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/universities/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("University Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUniversities((prev) =>
        prev.filter((university) => university.universityId !== id)
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "University Deleting failed!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Error While Deleting University : ", error);
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter") {
      navigate("/");
    }
  }, [userType]);

  const fetchUniversities = async () => {
    if(!authToken)
      navigate("/login");
    try {
      const response = await axios.get("http://localhost:8080/universities", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUniversities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  return (
    userType === "admin" ? (
      <AdminLayout>
          <UniversityForm
            addUniversity={addUniversity}
            updateUniversity={updateUniversity}
            editingUniversity={editingUniversity}
          />
          <UniversityList
            universities={universities}
            setEditingUniversity={setEditingUniversity}
            deleteUniversity={deleteUniversity}
          />
      </AdminLayout>
    ) :
    userType === "recruiter" && (
      <RecruiterLayout>
          <UniversityForm
            addUniversity={addUniversity}
            updateUniversity={updateUniversity}
            editingUniversity={editingUniversity}
          />
          <UniversityList
            universities={universities}
            setEditingUniversity={setEditingUniversity}
            deleteUniversity={deleteUniversity}
          />
      </RecruiterLayout>
    )
  );
}

export default University;
