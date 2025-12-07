import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import PositionForm from './PositionForm';
import Layout from '../Layout';


const Position = () => {
  const { authToken ,userType} = useContext(AuthContext);
  const navigate = useNavigate();

  const [position, setPosition] = useState({
    positionTitle: "",
    positionDescription: "",
    positionCriteria: "",
    positionTotalOpening: 1,
    positionType:"",
    positionSalary:"",
    positionLocation:"",
    positionLanguage: "",
    positionStatus: {
      status: "",
      positionStatusReason: ""
    },
    positionRequirements: [
    ],
    positionRequiredEducations: [],
    positionRounds: [
    ]
  });

  const [skills, setSkills] = useState([]);
  const [degrees, setDegrees] = useState([]);

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8080/skills", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSkills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };
  const fetchDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degrees", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setDegrees(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching Degrees:", error);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    
    fetchSkills();
    fetchDegrees();
  }, [authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPosition({ ...position, [name]: value });
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setPosition({
      ...position,
      positionStatus: { ...position.positionStatus, [name]: value }
    });
  };

  const handleRequirementChange = (index, e) => {
    const { name, value } = e.target;
    const newRequirements = [...position.positionRequirements];

    if (name === "skillId") newRequirements[index].positionSkill.skillId = parseInt(value);
    if (name === "positionRequirement") newRequirements[index].positionRequirement = value;
    if (name === "position") newRequirements[index].position = parseInt(value) || 1;

    setPosition({ ...position, positionRequirements: newRequirements });
  };

  const addRequirement = () => {
    setPosition({
      ...position,
      positionRequirements: [
        ...position.positionRequirements,
        { positionSkill: { skillId: "" }, position: position.positionRequirements.length + 1, positionRequirement: "" }
      ],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = [...position.positionRequirements];
    newRequirements.splice(index, 1);
    setPosition({ ...position, positionRequirements: newRequirements });
  };

  const addRound = () => {
    setPosition({
      ...position,
      positionRounds: [
        ...position.positionRounds,
        { positionRoundType: "", positionRoundSequence: position.positionRounds.length + 1, positionRoundExpectedDate: "", positionRoundExpectedStartTime: "" }
      ]
    });
  };

  const removeRound = (index) => {
    const newRounds = [...position.positionRounds];
    newRounds.splice(index, 1);
    setPosition({ ...position, positionRounds: newRounds });
  };

  const handleRoundChange = (index, e) => {
    const { name, value } = e.target;
    const newRounds = [...position.positionRounds];
    if (name === 'positionRoundSequence') { 
      newRounds[index][name] = parseInt(value) || 1;
    }else if (name === 'positionRoundDuration') { 
      newRounds[index][name] = parseInt(value) || 30;
    } else {
      newRounds[index][name] = value;
    }
    setPosition({ ...position, positionRounds: newRounds });
  };

  const handleEducationChange = (degreeId, isChecked) => {
    const selectedDegree = degrees.find(d => d.degreeId === degreeId);
    if (isChecked) {
      setPosition({
        ...position,
        positionRequiredEducations: [...position.positionRequiredEducations, selectedDegree]
      });
    } else {
      setPosition({
        ...position,
        positionRequiredEducations: position.positionRequiredEducations.filter(edu => edu.degreeId !== degreeId)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) return alert("You are not authorized!");

    try {
      await axios.post(
        "http://localhost:8080/positions/",
        position,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert("Position created successfully!");
      navigate('/admin/positions');
    } catch (error) {
      console.error("Error saving position:", error);
      alert(error?.response?.data?.message || "Error saving position");
    }
  };

  return (
      <Layout>
          <PositionForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            position={position}
            handleStatusChange={handleStatusChange}
            handleRequirementChange={handleRequirementChange}
            addRequirement={addRequirement}
            removeRequirement={removeRequirement}
            handleEducationChange={handleEducationChange}
            skills={skills}
            degrees={degrees}
            addRound={addRound}
            removeRound={removeRound}
            handleRoundChange={handleRoundChange}
          />
      </Layout>
  );
};

export default Position;
