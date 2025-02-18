import React, { useState } from "react";
import "./Signin.css";
import logo from "../assets/logo.png";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../environment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = () => {
    const {
        register: registerSignIn,
        handleSubmit: handleSubmitSignIn,
        formState: { errors: errorsSignIn },
    } = useForm();

    const {
        register: registerSignUp,
        handleSubmit: handleSubmitSignUp,
        formState: { errors: errorsSignUp },
    } = useForm();

    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const navigate = useNavigate();

    const toggleMode = () => setIsSignUpMode((prev) => !prev);

    const handleSignUp = (data) => {
        axios.post(`${API.BASE_URL}/api/users`, data, {
            headers: { "Content-Type": "application/json" }
        })
        .then((response) => {
            if (response.status === 201) {
                toast.success("Signup successful! Please login.");
                toggleMode();
            } else {
                toast.error("Signup failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Error signing up");
        });
    };

    const handleSignIn = async (data) => {
        try {
            const response = await axios.post(`${API.BASE_URL}/api/auth/login`, data, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.data && response.data.data.access_token) {
                localStorage.setItem("token", response.data.data.access_token);
                localStorage.setItem('userEmail', data.email);
                
                // Check if user is admin
                const isAdmin = response.data.data.user && response.data.data.user.role === 'admin';
                localStorage.setItem('userRole', isAdmin ? 'admin' : 'user');
                
                toast.success("Login successful");
                
                // Redirect based on role
                if (isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/body");
                }
            } else {
                toast.error("Login failed! Check your email and password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Error logging in. Please try again.");
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

            <main className={isSignUpMode ? "sign-up-mode" : ""}>
                <div className="box">
                    <div className="inner-box">
                        <div className="forms-wrap">
                            {/* Sign In Form */}
                            <form autoComplete="off" className="sign-in-form" onSubmit={handleSubmitSignIn(handleSignIn)}>
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
                                        <input type="email" className="input-field" placeholder="" {
                                            ...registerSignIn("email", { required: "The email field is required" })
                                        } />
                                        <label>Email</label>
                                    </div>
                                    <div className="error-container">
                                        {errorsSignIn.email && <p className="error">{errorsSignIn.email.message}</p>}
                                    </div>
                                    <div className="input-wrap">
                                        <input type="password" className="input-field" placeholder="" {
                                            ...registerSignIn("password", { required: "The password field is required" })
                                        } />
                                        <label>Password</label>
                                    </div>
                                    <div className="error-container">
                                        {errorsSignIn.password && <p className="error">{errorsSignIn.password.message}</p>}
                                    </div>
                                    <button type="submit" className="sign-btn">Sign In</button>
                                </div>
                            </form>






                            {/* Sign Up Form */}
                            <form autoComplete="off" className="sign-up-form" onSubmit={handleSubmitSignUp(handleSignUp)}>
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
                                            ...registerSignUp("name", { required: "The name field is required" })
                                        } />
                                        <label>Name</label>
                                    </div>
                                    <div className="error-container">
                                        {errorsSignUp.name && <p className="error">{errorsSignUp.name.message}</p>}
                                    </div>
                                    <div className="input-wrap">
                                        <input type="email" className="input-field" placeholder="" {
                                            ...registerSignUp("email", {
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
                                        {errorsSignUp.email && <p className="error">{errorsSignUp.email.message}</p>}
                                    </div>
                                    <div className="input-wrap">
                                        <input type="password" className="input-field" placeholder="" {
                                            ...registerSignUp("password", {
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
                                        {errorsSignUp.password && <p className="error">{errorsSignUp.password.message}</p>}
                                    </div>
                                    <button type="submit" className="sign-btn">Sign Up</button>
                                </div>
                            </form>
                        </div>

                        {/* Image Carousel */}
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
        </>
    );
};

export default Signin;
