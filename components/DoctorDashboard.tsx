'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import DoctorManageAppointments from '@/components/DoctorManageAppointments';

const DoctorDashboard = () => {
  const [view, setView] = useState<'make' | 'manage'>('make');

  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' gutterBottom>
          Doctor Dashboard
        </Typography>
        <DoctorManageAppointments />
      </Box>
    </Container>
  );
};

export default DoctorDashboard;
