import React, { useContext } from 'react';

import Loading from './../Components/Loading';
import AuthContext from '../Contexts/AuthContext/AuthContext';
import useRole from '../Hooks/useRole';
import Forbidden from '../Pages/Forbidden';

const HrRoute = ({ children }) => {
    const { loading, user } = useContext(AuthContext);
    const { role, roleLoading } = useRole()

    if (loading || !user || roleLoading) {
        return <Loading></Loading>
    }

    if (role !== 'hr') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default HrRoute;