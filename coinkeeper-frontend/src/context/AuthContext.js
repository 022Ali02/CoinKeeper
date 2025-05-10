import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            localStorage.setItem('token', response.data.token);
            setUser({ token: response.data.token });
            navigate('/');
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const response = await authAPI.register(email, password);
            localStorage.setItem('token', response.data.token);
            setUser({ token: response.data.token });
            navigate('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);