import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import Loading from './../Components/Loading';
import AuthContext from '../Contexts/AuthContext/AuthContext';
import useRole from '../Hooks/useRole';
import Forbidden from '../Pages/Forbidden';

const EmployeeRoute = ({ children }) => {
    const { loading, user } = useContext(AuthContext);
    const { role, roleLoading } = useRole();
    const location = useLocation();

    // ⏳ Wait only for loading states
    if (loading || roleLoading) {
        return <Loading />;
    }

    // 🔐 Not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 🚫 Not employee
    if (role !== 'employee') {
        return <Forbidden />;
    }

    // ✅ Allowed
    return children;
};

export default EmployeeRoute;
