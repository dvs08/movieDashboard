import React from 'react';
import '../styles/movie.css';

const BackButton = ({ details, onBack }) => {
  return (
    <section>
      <div className="content">
        <span>
          <a className="home_link" onClick={onBack}>Back</a>
        </span>
        <span style={{ fontSize: "30px", marginLeft: "5px" }}>|</span>
        <span style={{ marginLeft: "8px" }}>{details}</span>
      </div>
    </section>
  );
};

export default BackButton;
