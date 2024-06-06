'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Doctor, Clinic, User } from '@prisma/client';
import { useSession } from 'next-auth/react';

type DoctorWithUser = Doctor & { user: User };

const MakeAppointment: React.FC = () => {
  const { data: session, status } = useSession();

  const [service, setService] = useState<Clinic | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithUser | null>(
    null
  );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctors, setDoctors] = useState<DoctorWithUser[]>([]);
  const [services, setServices] = useState<Clinic[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch doctors and clinics from API
    const fetchDoctors = async () => {
      const response = await fetch('/api/doctors');
      const data: DoctorWithUser[] = await response.json();
      setDoctors(data);
    };

    const fetchServices = async () => {
      const response = await fetch('/api/clinics');
      const data: Clinic[] = await response.json();
      setServices(data);
    };

    fetchDoctors();
    fetchServices();
  }, []);

  const handleServiceChange = (_: any, value: Clinic | null) => {
    setService(value);
  };

  const handleDoctorChange = (_: any, value: DoctorWithUser | null) => {
    setSelectedDoctor(value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleSubmit = async () => {
    if (!service || !selectedDoctor || !date || !time) {
      setError('Please select all fields before submitting.');
      return;
    }

    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctorId: selectedDoctor?.id,
        date,
        time,
        patientId: session?.user.id, // Using the actual patient ID from the session
        clinicId: service?.id,
      }),
    });

    if (response.ok) {
      setOpen(true);
    } else {
      setError('Failed to book appointment');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setService(null);
    setSelectedDoctor(null);
    setDate('');
    setTime('');
    setError('');
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant='h5' gutterBottom>
        Make an Appointment
      </Typography>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          gap: 1,
          mt: 4,
        }}
      >
        <Autocomplete
          fullWidth
          options={services}
          getOptionLabel={(option: Clinic) => option.name}
          onChange={handleServiceChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Select Clinic'
              variant='outlined'
              fullWidth
            />
          )}
        />
        <Autocomplete
          fullWidth
          options={doctors}
          getOptionLabel={(option: DoctorWithUser) =>
            `${option.user.name} (${option.user.email})` || ''
          }
          onChange={handleDoctorChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Select Doctor'
              variant='outlined'
              fullWidth
            />
          )}
        />
        <TextField
          fullWidth
          type='date'
          value={date}
          onChange={handleDateChange}
          variant='outlined'
        />
        <TextField
          fullWidth
          type='time'
          value={time}
          onChange={handleTimeChange}
          variant='outlined'
        />
        {error && (
          <Typography color='error' variant='body2'>
            {error}
          </Typography>
        )}
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Book Appointment
        </Button>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Appointment Booked</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your appointment request has been sent to the doctor and will be
            updated once confirmed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MakeAppointment;
