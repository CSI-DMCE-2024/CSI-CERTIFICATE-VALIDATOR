import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import VerifyCertificate from "./VerifyCertificate/VerifyCertificate";
import Login from "./Login/Login";
import VerifyCertificateHome from "./VerifyCertificate/VerifyCertificateHome";

const Auth = () => (
  <Routes>
    <Route index element={<Navigate to="/verify-certificate" />} />
    <Route path="/verify-certificate" element={<VerifyCertificateHome />} />
    <Route path="/verify-certificate/:uid" element={<VerifyCertificate />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default Auth;
