import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SkillForm from "./SkillForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layout";

function Skill() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);

  const addSkill = async (formData) => {
    if(!authToken) navigate("/login");
    if(!formData) return;
    
    try {
      await axios.post("http://localhost:8080/skills/", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Skill Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response.data.skill[0] || "Skill Adding failed!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter") {
      navigate("/");
    }
  }, [userType]);

  return (
    <Layout>
      <SkillForm addSkill={addSkill} />
    </Layout>
  );
}

export default Skill;
