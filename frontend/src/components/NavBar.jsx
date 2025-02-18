import React, { useState, useEffect, useRef } from "react";
import styles from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = ({ onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUserEmail('');
    onSignOut();
    navigate('/signin');
    setIsMenuOpen(false);
    setShowProfileDropdown(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim() === "") {
      setSearchResults([]);
      setShowPopup(false);
      return;
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`/api/recipes/search?query=${encodeURIComponent(query)}`);
        setSearchResults(response.data.data);
        setShowPopup(true);
      } catch (error) {
        console.error("Error searching recipes:", error);
      }
    }, 300); // Debounce for 300ms
  };

  const handleRecipeClick = (recipeId) => {
    setShowPopup(false);
    setSearchQuery("");
    navigate(`/recipe/${recipeId}`);
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

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.searchContainer}`)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <input 
                  placeholder="Search recipes..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {showPopup && searchResults.length > 0 && (
                <div className={styles.searchPopup}>
                  {searchResults.map((recipe) => (
                    <div
                      key={recipe.id}
                      className={styles.searchResult}
                      onClick={() => handleRecipeClick(recipe.id)}
                    >
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className={styles.searchResultImage}
                      />
                      <span>{recipe.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.profileSection} ref={profileRef}>
              <div 
                className={styles.profileIcon} 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className={styles.avatarPlaceholder}>
                  {userEmail ? userEmail[0].toUpperCase() : 'U'}
                </div>
              </div>
              {showProfileDropdown && (
                <div className={styles.profileDropdown}>
                  <div className={styles.userInfo}>
                    <div className={styles.dropdownAvatarPlaceholder}>
                      {userEmail ? userEmail[0].toUpperCase() : 'U'}
                    </div>
                    <span className={styles.userEmail}>{userEmail}</span>
                    <span className={styles.userRole}>Signed in</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Sign out
                  </button>
                </div>
              )}
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
