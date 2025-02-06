import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import {Link} from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 800);
    if (window.innerWidth >= 800) {
      setIsMenuOpen(false); // Close menu if resizing back to desktop
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <label htmlFor="cook">CookoPedia</label>
      </div>
      {!isMobile || isMenuOpen ? (
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          <Link to = "/Body">Home</Link>
          <Link to = "/AboutUs">About Us</Link>
          <Link to="/Contacts">Contacts</Link> 
          <Link to ="/addRecipe" >Add Recipe</Link>
        </div>
      ) : null}
      <div className={styles.searchBar}>
        <input placeholder="Search recipes..." type="text" />
      </div>
      <div className={styles.burgerMenu} onClick={toggleMenu}>
        {!isMenuOpen ? (
          <>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </>
        ) : (
          <div className={styles.cross}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
