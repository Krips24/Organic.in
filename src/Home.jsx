import React from "react";
import Navbar from "./Navbar";

function home() {
  return (
    <div>
      <link rel="stylesheet" type="text/css" href="/css/home/styles.css" />
      <Navbar />
      <img className="home-image" src="/css/home/images/home.svg" />

      <div className="home-content">
        <h1>Welcome to Organic!</h1>
        <p>
          Explore culinary creativity at Organic.in! Our recipe generator sparks
          inspiration for both seasoned chefs and kitchen novices. Join us for a
          celebration of flavor, creativity, and the joy of good food!
        </p>
        <a className="start-now-button" href="/features">
          START NOW
        </a>
      </div>
    </div>
  );
}

export default home;
