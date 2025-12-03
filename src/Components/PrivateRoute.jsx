// @flow strict

import * as React from 'react';
import { Navigate } from 'react-router';
import { use } from 'react';

import { AuthContext } from './../Contexts/AuthContext/AuthProvider';
import Loading from './Loading';



const  PrivateRoute=({children}) =>{
 
const{user,loading}=use(AuthContext)
if(loading){
    return <Loading></Loading>
}
if(user && user?.email){
    return children
}

    return < Navigate to ="/auth/login"></Navigate>
          
   
    
  
};

export default PrivateRoute;
