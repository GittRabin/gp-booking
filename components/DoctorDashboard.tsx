'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import DoctorManageAppointments from '@/components/DoctorManageAppointments';

const DoctorDashboard = () => {
  const [view, setView] = useState<'make' | 'manage'>('make');

  return (
    <Container maxWidth='lg'>
      <DoctorManageAppointments />
    </Container>
  );
};

export default DoctorDashboard;
