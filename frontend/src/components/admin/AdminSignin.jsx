import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { API } from "../../../environment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSignin.css";

const AdminSignin = () => {
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
        // Add role as admin
        const adminData = { ...data, role: 'admin' };
        
        axios.post(`${API.BASE_URL}/api/admin/register`, adminData, {
            headers: { "Content-Type": "application/json" }
        })
        .then((response) => {
            if (response.status === 201) {
                toast.success("Admin registration successful! Please login.");
                toggleMode();
            } else {
                toast.error("Registration failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Error registering admin");
        });
    };

    const handleSignIn = async (data) => {
        try {
            const response = await axios.post(`${API.BASE_URL}/api/admin/login`, data, {
                headers: { "Content-Type": "application/json" }
            });
            
            if (response.data && response.data.data) {
                // Store admin token and details
                localStorage.setItem('adminToken', response.data.data.access_token);
                localStorage.setItem('adminId', response.data.data.user.adminId);
                localStorage.setItem('adminEmail', response.data.data.user.email);
                localStorage.setItem('adminName', response.data.data.user.name);
                localStorage.setItem('userRole', 'admin');

                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="admin-signin-container">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

            <div className={`admin-form-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
                <div className="admin-forms-wrap">
                    {/* Sign In Form */}
                    <form className="admin-sign-in-form" onSubmit={handleSubmitSignIn(handleSignIn)}>
                        <h2>Admin Login</h2>
                        <div className="form-group">
                            <input
                                type="email"
                                {...registerSignIn("email", { required: "Email is required" })}
                                placeholder="Email"
                            />
                            {errorsSignIn.email && <span className="error">{errorsSignIn.email.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                {...registerSignIn("password", { required: "Password is required" })}
                                placeholder="Password"
                            />
                            {errorsSignIn.password && <span className="error">{errorsSignIn.password.message}</span>}
                        </div>
                        <button type="submit" className="admin-btn">Sign In</button>
                        <p>
                            Need admin access?{" "}
                            <span className="toggle-link" onClick={toggleMode}>
                                Register here
                            </span>
                        </p>
                    </form>

                    {/* Sign Up Form */}
                    <form className="admin-sign-up-form" onSubmit={handleSubmitSignUp(handleSignUp)}>
                        <h2>Admin Registration</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                {...registerSignUp("name", { required: "Name is required" })}
                                placeholder="Full Name"
                            />
                            {errorsSignUp.name && <span className="error">{errorsSignUp.name.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                {...registerSignUp("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                placeholder="Email"
                            />
                            {errorsSignUp.email && <span className="error">{errorsSignUp.email.message}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                {...registerSignUp("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                placeholder="Password"
                            />
                            {errorsSignUp.password && <span className="error">{errorsSignUp.password.message}</span>}
                        </div>
                        <button type="submit" className="admin-btn">Register</button>
                        <p>
                            Already have admin access?{" "}
                            <span className="toggle-link" onClick={toggleMode}>
                                Sign in here
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSignin;
