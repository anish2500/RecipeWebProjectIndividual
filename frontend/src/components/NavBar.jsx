import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const navigate = useNavigate();

  const handleLogout = () => {
    onSignOut(); // Call the logout function from props
    navigate('/signin'); // Navigate to signin page
    setIsMenuOpen(false); // Close the mobile menu if open
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 800);
    if (window.innerWidth >= 800) {
      setIsMenuOpen(false);
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
          <div className={styles.mainLinks}>
            <Link to="/Body">Home</Link>
            <Link to="/AboutUs">About Us</Link>
            <Link to="/Contacts">Contacts</Link> 
            <Link to="/addRecipe">Add Recipe</Link>
            <Link to="/recipes">Recipes</Link>
          </div>
          <div className={styles.rightControls}>
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
            <div className={styles.searchBar}>
              <input placeholder="Search recipes..." type="text" />
            </div>
          </div>
        </div>
      ) : null}
      <div className={styles.burgerMenu} onClick={toggleMenu}>
        {!isMenuOpen ? (
          <>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </>
        ) : (
          <>
            <div className={`${styles.line} ${styles.open}`}></div>
            <div className={`${styles.line} ${styles.open}`}></div>
            <div className={`${styles.line} ${styles.open}`}></div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;