import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function ComingSoon() {
    return (
        <div className="coming-soon-container">
            <h1>&#128679; Coming Soon &#128679;</h1>
            <p>This page is under construction.<br />We’re working hard to bring you this feature!</p>
            <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
    );
}