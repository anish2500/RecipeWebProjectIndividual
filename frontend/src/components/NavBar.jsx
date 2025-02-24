import React, { useState, useEffect, useRef } from "react";
import styles from "./NavBar.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const NavBar = ({ onSignOut }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

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
    console.log('Searching for:', query); // Debug log
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim() === "") {
        setSearchResults([]);
        setShowPopup(false);
        return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
        try {
            console.log('Making API call for:', query); // Debug log
            const response = await axiosInstance.get(`/api/recipes/search?query=${encodeURIComponent(query)}`);
            console.log('Search response:', response.data); // Debug log
            
            if (response.data.data && response.data.data.length > 0) {
                setSearchResults(response.data.data);
                setShowPopup(true);
            } else {
                setSearchResults([]);
                setShowPopup(true); // Show "No results found"
            }
        } catch (error) {
            console.error("Error searching recipes:", error);
            setSearchResults([]);
            setShowPopup(true); // Keep popup visible to show error state
        }
    }, 300);
  };

  const handleRecipeClick = (recipeId) => {
    setShowPopup(false);
    setSearchQuery("");
    navigate(`/view-recipe/${recipeId}`); // Updated to match the route in App.jsx
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

  const isActive = (path) => {
    return currentPath === path ? styles.active : '';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <label htmlFor="cook">CookoPedia</label>
        <Link to="/admin/signin" className={styles.adminButton}>
          Admin
        </Link>
      </div>
      {!isMobile || isMenuOpen ? (
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ""}`}>
          <div className={styles.mainLinks}>
            <Link to="/Body" className={isActive('/Body')}>Home</Link>
            <Link to="/AboutUs" className={isActive('/AboutUs')}>About Us</Link>
            <Link to="/Contacts" className={isActive('/Contacts')}>Contacts</Link> 
            <Link to="/addRecipe" className={isActive('/addRecipe')}>Add Recipe</Link>
            <Link to="/recipes" className={isActive('/recipes')}>Recipes</Link>
          </div>
          <div className={styles.rightControls}>
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {showPopup && (
                <div className={styles.searchResults}>
                  {searchResults.length > 0 ? (
                    searchResults.map((recipe) => (
                      <div
                        key={recipe.id}
                        className={styles.searchResultItem}
                        onClick={() => handleRecipeClick(recipe.id)}
                      >
                        {recipe.title}
                      </div>
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      No recipes found
                    </div>
                  )}
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
