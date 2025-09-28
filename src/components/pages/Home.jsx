import React, { use, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {

    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const logoutHandler = () => {
        navigate("/logout");
    }

    const profilePageGoto = ()=>{
        navigate("/profile");
    }

    useEffect(() => {
        if (!authToken) {
            navigate("/login");
        }
    }, []);

    return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-800">
        <div>
            <h1 className="text-4xl font-bold text-white">
                Welcome to the Home Page
            </h1>
            <div className="flex justify-center items-center p-5">
                <button onClick={logoutHandler} className="flex p-5 bg-neutral-700 rounded-2xl text-white">Logout</button>
            </div>
            <div className="flex justify-center items-center p-5">
                <button onClick={profilePageGoto} className="flex p-5 bg-neutral-700 rounded-2xl text-white">Profile</button>
            </div>
        </div>
    </div>
  );
}

export default Home;
