import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin/signin');
            return;
        }

        const fetchData = async () => {
            try {
                const [usersResponse, recipesResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/users', {
                        headers: { Authorization: `Bearer ${adminToken}` }
                    }),
                    axios.get('http://localhost:5000/api/recipes', {
                        headers: { Authorization: `Bearer ${adminToken}` }
                    })
                ]);

                setUsers(usersResponse.data.data);
                setRecipes(recipesResponse.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/signin');
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/signin');
    };

    const handleDeleteUser = async (userId) => {
        const adminToken = localStorage.getItem('adminToken');
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setUsers(users.filter(user => user.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/signin');
            } else {
                alert('Failed to delete user. Please try again.');
            }
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        const adminToken = localStorage.getItem('adminToken');
        if (!window.confirm('Are you sure you want to delete this recipe?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
            alert('Recipe deleted successfully');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/signin');
            } else {
                alert('Failed to delete recipe. Please try again.');
            }
        }
    };

    const switchToUserPortal = () => {
        // Clear ALL stored data to ensure a fresh start
        localStorage.clear();
        // Navigate to the signin page
        navigate('/signin', { replace: true });
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="header-buttons">
                    <button 
                        onClick={switchToUserPortal} 
                        className="user-portal-btn"
                    >
                        Go to User Login
                    </button>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="users-section">
                        <h2>Users Management</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {/* <th>Username</th> */}
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            {/* <td>{user.username}</td> */}
                                            <td>{user.email}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="recipes-section">
                        <h2>Recipes Management</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        {/* <th>Category</th> */}
                                        {/* <th>Author</th> */}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recipes.map(recipe => (
                                        <tr key={recipe.id}>
                                            <td>{recipe.title}</td>
                                            {/* <td>{recipe.category}</td> */}
                                            {/* <td>{recipe.author}</td> */}
                                            <td>
                                                <button 
                                                    onClick={() => handleDeleteRecipe(recipe.id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
