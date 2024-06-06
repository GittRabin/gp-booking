'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import MakeAppointment from '@/components/MakeAppointment';
import ManageAppointments from '@/components/ManageAppointments';

const PatientDashboard = () => {
  const [view, setView] = useState<'make' | 'manage'>('make');

  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4' gutterBottom>
          Patient Dashboard
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button
            variant='contained'
            onClick={() => setView('make')}
            sx={{ mr: 2 }}
          >
            Make Appointment
          </Button>
          <Button variant='contained' onClick={() => setView('manage')}>
            Manage Appointments
          </Button>
        </Box>
        {view === 'make' ? <MakeAppointment /> : <ManageAppointments />}
      </Box>
    </Container>
  );
};

export default PatientDashboard;
