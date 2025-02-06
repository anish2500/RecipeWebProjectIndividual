import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.column}>
        <h4>About RecipeFinder</h4>
        <p>
          Discover and share the best Indian and Nepali recipes. Join our
          community of food lovers!
        </p>
      </div>
      <div className={styles.column}>
        <h4>Quick Links</h4>
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a href="#">Contact</a>
        <a href="#">Add Recipe</a>
      </div>
   
      <div className={styles.copyright}>© 2024 DesiRecipes. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
