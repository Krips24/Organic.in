import React from "react";
import Navbar from "./Navbar";

function About() {
    return (
        <div className="about-container">
            <Navbar />
            <div className="content">
            <link rel="stylesheet" type="text/css" href="/css/home/styles.css" />

                <h1>About Us</h1>
                <p>
                    Welcome to our website! We are a team of passionate individuals
                    dedicated to providing valuable information and services to our users.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...
                </p>
            </div>
        </div>
    );
}

export default About;