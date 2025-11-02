import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DegreeForm from "./DegreeForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../Layout";

function Degree() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);

  const addDegree = async (formData) => {
    if (!authToken) 
      navigate("/login");
    if (!formData) return;

    try {
      await axios.post("http://localhost:8080/degrees/", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Degree Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response.data.degree[0] || "Degree Adding failed!", {
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
      <DegreeForm addDegree={addDegree} />
    </Layout>
  )
}

export default Degree;
