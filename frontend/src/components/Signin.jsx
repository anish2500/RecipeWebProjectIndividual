import React, { useState } from "react";
import "./Signin.css";
import logo from "../assets/logo.png";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import {useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Signin = () => {



    const {
        register,
        handleSubmit,
        formState: { errors },
    }  = useForm();

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  // const navigate = useNavigate();
  const toggleMode = () => setIsSignUpMode((prev) => !prev);


  const handleSignUp = (data) => {
    const { name, email, password } = data;

    // Retrieve existing users from localStorage or initialize an empty array
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if the user already exists
    const userExists = existingUsers.some((user) => user.email === email);

    if (userExists) {
      // Alert user if the email is already registered
      alert("User with this email already exists!");
    } else {
      // Add the new user to the existing users and store in localStorage
      existingUsers.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(existingUsers));
      alert("Signup successful! Please login."); // Notify user of successful signup
      toggleMode(); // Switch to signin form
    }
  };
  const handleSignIn = (data) => {
    const { email, password } = data;

    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    // Find a user matching the email and password
    const user = existingUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // If user exists, greet them and navigate to the dashboard
      alert(`Welcome back, ${user.name}!`);
      navigate("/NavBar"); // Redirect to the dashboard page
    } else {
      // Alert the user if login details are incorrect
      alert("Invalid email or password!");
    }
  };

  return (
    <main className={isSignUpMode ? "sign-up-mode" : ""}>
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form autoComplete="off" className="sign-in-form" onSubmit={handleSubmit(handleSignIn)}>
              <div className="logo">
                <img src={logo} alt="cookopedia" />
                <h4>CookoPedia</h4>
              </div>
              <div className="heading">
                <h2>Welcome Back</h2>
                <h6>Not registered yet?</h6>
                <a href="#" className="toggle" onClick={toggleMode}>Sign up</a>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input type="text" minLength="4" className="input-field" placeholder="" {
                    ...register("name", {
                        required: "This field is required",
                        minLength: {
                            value: 4,
                            message: "Minimum length should be 4",
                        },
                    })
                  }
                  

                   />
                  
                  <label>Name</label>
                
                </div>
                <div className="error-container">
                          {errors.name && <p className="error">{errors.name.message}</p>}
                   </div>
                <div className="input-wrap">
                  <input type="password" minLength="4" className="input-field" placeholder="" {
                    ...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 4,
                            
                            message: "Minimum length should be 4",
                        },pattern: {value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, message: "Password must include letter and numbers"
                        }
                    })
                  }
                  
                  />
                  <label>Password</label>
                 
                  
                 
                </div>
                <div className="error-container">
                            {errors.password && <p className="error">{errors.password.message}</p>}
                  </div>
                <button type="submit" className="sign-btn">Sign In</button>
                <p class="text">
                  Forgotten your password or you login datails?
                  <a href="#">Get help</a> signing in
                </p>
              </div>
            </form>
            <form autoComplete="off" className="sign-up-form" onSubmit={handleSubmit(handleSignUp)}>
              <div className="logo">
                <img src={logo} alt="cookopedia" />
                <h4>CookoPedia</h4>
              </div>
              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <a href="#" className="toggle" onClick={toggleMode}>Sign in</a>
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input type="text" className="input-field" placeholder="" {
                    ...register("name", {
                        required: "The name field is required",
                    })
                  } />
                  <label>Name</label>

                </div>
                <div className="error-container">
                    {errors.name && <p className="error">{errors.name.message}</p>}
                </div>
                <div className="input-wrap">
                  <input type="email" className="input-field" placeholder=""{
                    ...register("email", {
                        required: "The email field is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address",
                        },
                    })
                  } />
                  <label>Email</label>
                </div>
                <div className="error-container">
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>
                <div className="input-wrap">
                  <input type="password" className="input-field" placeholder="" {
                    ...register("password", {
                        required: "The password field is required",
                        minLength: {
                            value: 4,
                            message: "Minimum length should be 4",
                        },
                    })
                  } />
                  <label>Password</label>
                </div>
                <div className="error-container">
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>
                <button type="submit" className="sign-btn">Sign Up</button>

                <p class="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>
          <div className="carousel">
            <div className="images-wrapper">
              <img src={image1} className={`image img-1 ${!isSignUpMode ? "show" : ""}`} alt="" />
              <img src={image2} className={`image img-2 ${isSignUpMode ? "show" : ""}`} alt="" />
              <img src={image3} className="image img-3" alt="" />
            </div>
            <div className="bullets">
              <span className={isSignUpMode ? "" : "active"} data-value="1"></span>
              <span className={isSignUpMode ? "active" : ""} data-value="2"></span>
              <span data-value="3"></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signin;
