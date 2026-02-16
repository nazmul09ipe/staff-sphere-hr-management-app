import React, { useContext } from 'react';


import AuthContext from '../Contexts/AuthContext/AuthContext';
import useRole from '../Hooks/useRole';
import Forbidden from '../Pages/Forbidden';
import Loading from './../Components/Loading';

const AdminRoute = ({ children }) => {
    const { loading, user } = useContext(AuthContext);
    const { role, roleLoading } = useRole()

    if (loading || !user || roleLoading) {
        return <Loading></Loading>
    }

    if (role !== 'admin') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default AdminRoute;