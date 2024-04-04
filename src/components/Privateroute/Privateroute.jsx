import Cookies from 'js-cookie';
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import {BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import Receptionhome from "../../pages/Receptionpage/Receptionhome";

const PrivateRoute = ({ element, isReception, isDoctor, isPharmacy, ...rest }) => {
    const isAuthenticated = Cookies.get('token') !== undefined;
    const decodedToken = decodeToken();
    const userRole = decodedToken ? getUserRole(decodedToken) : null;
  
    function decodeToken() {
      try {
        const token = Cookies.get('token');
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
  
    function getUserRole(decodedToken) {
      if (decodedToken.is_reception) {
        return 'receptionist';
      } else if (decodedToken.is_doctor) {
        return 'doctor';
      } else if (decodedToken.is_pharmacy) {
        return 'pharmacy';
      } else {
        return null;
      }
    }
  
    const isAuthorized =
      isAuthenticated &&
      ((isReception && userRole === 'receptionist') ||
        (isDoctor && userRole === 'doctor') ||
        (isPharmacy && userRole === 'pharmacy'));
  
    
    if (isAuthorized && isReception) {
      return (
        <Routes>
          <Route path="/reception/home" element={<Receptionhome/>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }
  
    return <Route {...rest} element={isAuthorized ? element : <Navigate to="/login" replace />} />;
  };
  
  export default PrivateRoute;
  