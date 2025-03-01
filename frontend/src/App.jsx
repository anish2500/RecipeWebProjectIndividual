import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Body from './components/Body';
import ViewRecipe from './components/ViewRecipe';
import AddRecipe from './components/AddRecipe';
import Contacts from './components/Contacts';
import AboutUs from './components/AboutUs';
import ProtectedRoute from '../ProtectedRoute.jsx';
import Recipes from './components/Recipes';

// Lazy load admin components
const AdminSignin = lazy(() => import('./components/admin/AdminSignin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const Signin = lazy(() => import('./components/Signin'));

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Function to handle successful sign-in
  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  // Function to handle sign-out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="signin" element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminSignin />
            </Suspense>
          } />
          <Route path="dashboard" element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminDashboard />
            </Suspense>
          } />
        </Route>

        {/* Public Routes */}
        <Route path="/signin" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Signin onSignIn={handleSignIn} />
          </Suspense>
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/body" element={<Body onSignOut={handleSignOut} />} />
          <Route path="/view-recipe/:recipeId" element={<ViewRecipe />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/recipes" element={<Recipes />} />
        </Route>

        {/* Redirect unauthenticated users to signin */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/body" replace /> : <Navigate to="/signin" replace />
        } />
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/body" replace /> : <Navigate to="/signin" replace />
        } />
      </Routes>
    </Router>
  );
};

export default App;