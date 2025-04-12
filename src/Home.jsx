import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const goToUser = () => {
    navigate("/login");
  };

  const goToVendor = () => {
    window.open("http://localhost:5000", "_blank"); // or hosted Flask link
  };

  return (
    <div className="home-container">
      <h1>Welcome to <span className="highlight">UPIWise</span></h1>
      <p className="subtext">Smarter spending. Better saving.</p>
      <div className="button-group">
        <button onClick={goToUser}>I am a User</button>
        <button onClick={goToVendor}>I am a Vendor</button>
      </div>
    </div>
  );
};

export default Home;
