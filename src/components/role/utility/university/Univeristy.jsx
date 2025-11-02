import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UniversityForm from "./UniversityForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layout";

function University() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);

  const addUniversity = async (formData) => {
    if(!authToken) navigate("/login");
    if (!formData) return;
    
    try {
      await axios.post("http://localhost:8080/universities/", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("University Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response.data.university[0] || "University Adding failed!", {
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
      <UniversityForm addUniversity={addUniversity} />
    </Layout>
  );
}

export default University;
