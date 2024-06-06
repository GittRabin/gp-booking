'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

type Appointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
};

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const handleModify = (appointmentId: string) => {
    // Handle modify appointment
  };

  const handleCancel = async (appointmentId: string) => {
    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== appointmentId)
      );
      alert('Appointment canceled successfully');
    } else {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant='h5' gutterBottom>
        Manage Appointments
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, mt: 4 }}>
        <List>
          {appointments.map((appointment) => (
            <ListItem
              key={appointment.id}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <ListItemText
                primary={`Appointment with ${appointment.doctorName} on ${appointment.date} at ${appointment.time}`}
                secondary={`Status: ${appointment.status}`}
              />
              <Box>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{ mr: 2 }}
                  onClick={() => handleModify(appointment.id)}
                >
                  Modify
                </Button>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => handleCancel(appointment.id)}
                >
                  Cancel
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ManageAppointments;
