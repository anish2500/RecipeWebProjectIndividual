import React from "react";
import styles from "./AboutUs.module.css";
import NavBar from './NavBar';

const AboutUs = () => {
  return (
    <div className={styles.page}>
     

      <div className={styles.container}>
        <div className={styles.content}>
          <h1>About DesiRecipes</h1>
          <p>
            Welcome to DesiRecipes, your ultimate destination for authentic Indian and Nepali culinary experiences.
          </p>
          <p>Our mission is to make cooking authentic Desi dishes accessible to everyone.</p>
          <div className={styles.stats}>
            <div>
              <h2>1000+</h2>
              <p>Authentic Recipes</p>
            </div>
            <div>
              <h2>500K+</h2>
              <p>Happy Cooks</p>
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img
            alt="Chefs preparing food in a kitchen"
            height="400"
            src="https://storage.googleapis.com/a1aa/image/CMfWKaWs3gwkQqaXzZ4R4YJkAmkwbSB4T4802SIgVTfjODDUA.jpg"
            width="600"
          />
          <a className={styles.cta} href="#">
            Join our community
            <br />
            Share your recipes & experiences
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
