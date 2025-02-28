import React from "react";
import { Link } from "react-router-dom";
import '../styles/About.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="header">
        <h1>About this Project</h1>
        <p className="description">The features on this website are built to apply the tools created in my dissertation "A Theory of Sets and Harmonic Complexity in Just Intonation and its Equal Temperament Approximations in the Chamber Music of Georg Friedrich Haas." The <Link to='/calculator'>Set Calculator</Link> enables one to enter a set of integers, which are then interpreted as a set of partials, partial-classes, and the set classes to which they belong. These interpretations are both as pitches and as pitch-classes. The calculator then allows one to transpose their set by some specified integer. The <Link to='/lattice'>Ratio Lattice Generator</Link> invites the user to experiment with creating a ratio lattices and understand its harmonic relationships via a manipulable 3D model. New ratios are generated on the lattice as the user inputs them, allowing one to create and understand the lattice step-by-step. The abstract for the disertation can be found below:</p>
        <h2>Abstract</h2>
        <p className="description">
          Just Intonation (JI), with its foundation in the harmonic series, resists many of the analytical tools developed for music in equal-tempered (ET). Ratio-based approaches offer precision in describing JI’s intervallic relationships but struggle to account for larger-scale harmonic organization, while set-theoretic models developed for ET  rarely engage with JI’s rational tuning systems. In this dissertation, I develop a set-theoretic framework for JI that remains attuned to its acoustic and perceptual realities while expanding the analytical vocabulary available for microtonal music. I examine two principal traditions in contemporary JI composition: extended JI, which applies systematic and transformational approaches to rational tuning, and spectral practices that explore the fluid interactions between JI and ET. These analytical tools are applied to a diverse repertoire, ranging from works that rigorously adhere to JI structures to those that blur the boundaries between tuning systems.
        </p>
        <p className="description">
          The dissertation is divided into two parts, each addressing distinct but interrelated aspects of JI and its applications. Part 1, “A Theory of Sets and Harmonic Complexity in Just Intonation,” introduces the theoretical framework and analytical tools underpinning the study. It comprises three chapters: Chapter 1 provides a general introduction, Chapter 2 defines the key concepts and tools, and Chapter 3 demonstrates their application in analyzing contemporary compositions employing JI.
        </p>
        <p className="description">
          Part 2, “Equal Temperament Approximations and Harmonic Complexity in the Chamber Music of Georg Friedrich Haas,” builds on the methods and tools from Part 1 to explore Haas’ integration of JI and ET in his music. This part includes four chapters: Chapter 4 introduces Haas’ chamber music up to 2015, highlighting his distinctive style and techniques. Chapter 5 focuses on what I call static harmony in Haas’ works, while Chapter 6 examines his use of progressive harmony. Chapter 7 concludes Part 2 by discussing large-scale structure in select chamber works and offering a summary of the dissertation with directions for future research.
        </p>
      </header>
    </div>
  );
};

export default AboutPage;
