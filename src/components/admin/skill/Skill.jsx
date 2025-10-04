import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import SkillList from "./SkillList";
import SkillForm from "./SkillForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Skill() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [skills, setSkills] = useState([]); // State to store all skills
  const [editingSkill, setEditingSkill] = useState(null); // State for editing a skill

  // Add a new skill
  const addSkill = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/skill/",
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
    setSkills((prev) =>
      prev.map((skill) =>
        skill.skillId === updatedSkill.skillId ? updatedSkill : skill
      )
    );
    try {
      await axios.put(
        `http://localhost:8080/skill/${updatedSkill.skillId}`,
        updatedSkill,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
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
    try {
      await axios.delete(`http://localhost:8080/skill/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("Skill Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Skill Deleting failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error deleting skill:", error);
    }
    setSkills((prev) => prev.filter((skill) => skill.skillId !== id));
  };

  useEffect(() => {
    if (userType !== "admin") {
      navigate("/home");
    }
  }, [userType]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8080/skill/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSkills(response.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
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
            {/* Skill Form */}
            <SkillForm
              addSkill={addSkill}
              updateSkill={updateSkill}
              editingSkill={editingSkill}
            />

            {/* Skill List */}
            <SkillList
              skills={skills}
              setEditingSkill={setEditingSkill}
              deleteSkill={deleteSkill}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Skill;
