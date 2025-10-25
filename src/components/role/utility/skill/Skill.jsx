import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/AdminLayout";
import SkillList from "./SkillList";
import SkillForm from "./SkillForm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecruiterLayout } from "../../recruiter/RecruiterComponents";

function Skill() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [skills, setSkills] = useState([]); // State to store all skills
  const [editingSkill, setEditingSkill] = useState(null); // State for editing a skill

  const addSkill = async (formData) => {
    if(!authToken)
      navigate("/login");
    if(!formData)
      return
    try {
      const response = await axios.post(
        "http://localhost:8080/skills/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSkills((prev) => [...prev, response.data]);
      toast.success("Skill Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Skill Adding failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error adding skill:", error);
    }
    setEditingSkill(null);
  };

  // Update an existing skill
  const updateSkill = async (updatedSkill) => {
    if(!authToken)
      navigate("/login");
    if(!updatedSkill)
      return
    try {
      await axios.put(
        `http://localhost:8080/skills/${updatedSkill.skillId}`,
        updatedSkill,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSkills((prev) =>
        prev.map((skill) =>
          skill.skillId === updatedSkill.skillId ? updatedSkill : skill
        )
      );
      toast.success("Skill Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Skill Updating failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error updating skill:", error);
    }
    setEditingSkill(null); // Clear editing state
  };

  // Delete a skill
  const deleteSkill = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    try {
      await axios.delete(`http://localhost:8080/skills/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Skill Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setSkills((prev) => prev.filter((skill) => skill.skillId !== id));
    } catch (error) {
      toast.error(error?.response?.data?.data || "Skill Deleting failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      console.error("Error deleting skill:", error);
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter") {
      navigate("/");
    }
  }, [userType]);

  const fetchSkills = async () => {
    if(!authToken)
      navigate("/login");
    try {
      const response = await axios.get("http://localhost:8080/skills", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSkills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    userType === "admin" ? (
      <AdminLayout>
          <SkillForm
            addSkill={addSkill}
            updateSkill={updateSkill}
            editingSkill={editingSkill}
          />
          <SkillList
            skills={skills}
            setEditingSkill={setEditingSkill}
            deleteSkill={deleteSkill}
          />
      </AdminLayout>
    ) :
    userType === "recruiter" && (
      <RecruiterLayout>
          <SkillForm
            addSkill={addSkill}
            updateSkill={updateSkill}
            editingSkill={editingSkill}
          />
          <SkillList
            skills={skills}
            setEditingSkill={setEditingSkill}
            deleteSkill={deleteSkill}
          />
      </RecruiterLayout>
    )

    
  );
}

export default Skill;
