import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentRepository from './StudentRepository';
import MentorRepository from './MentorRepository';
import AdminRepository from './AdminRepository';
import { Navigate } from 'react-router-dom';

const Repository = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') return <StudentRepository />;
  if (user.role === 'admin') return <AdminRepository />;
  return <MentorRepository />;
};

export default Repository;
