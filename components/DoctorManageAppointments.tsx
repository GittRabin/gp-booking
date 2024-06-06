'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useSession } from 'next-auth/react';

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  doctors: {
    doctor: {
      user: {
        name: string;
      };
    };
  }[];
  clinic: {
    name: string;
  };
};

const ManageAppointments: React.FC = () => {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const handleModify = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setNewStatus(appointment.status);
    setOpenModifyDialog(true);
  };

  const handleCancel = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (selectedAppointment) {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'CANCELLED',
          }),
        }
      );

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === selectedAppointment.id
              ? { ...appt, status: 'CANCELLED' }
              : appt
          )
        );
        setOpenCancelDialog(false);
        setSelectedAppointment(null);
      } else {
        alert('Failed to cancel appointment');
      }
    }
  };

  const confirmModify = async () => {
    if (selectedAppointment) {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: newDate,
            time: newTime,
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === selectedAppointment.id
              ? { ...appt, date: newDate, time: newTime, status: newStatus }
              : appt
          )
        );
        setOpenModifyDialog(false);
        setSelectedAppointment(null);
      } else {
        alert('Failed to modify appointment');
      }
    }
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
    setOpenModifyDialog(false);
    setSelectedAppointment(null);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const dateObj = new Date();
    dateObj.setHours(parseInt(hour, 10));
    dateObj.setMinutes(parseInt(minute, 10));
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant='h5' gutterBottom>
        Manage Appointments
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, mt: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Clinic</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointment.doctors[0]?.doctor.user.name}
                  </TableCell>
                  <TableCell>{appointment.clinic.name}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{formatTime(appointment.time)}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{ mr: 2 }}
                      onClick={() => handleModify(appointment)}
                    >
                      Modify
                    </Button>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => handleCancel(appointment)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openCancelDialog} onClose={handleClose}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your appointment with Dr.{' '}
            {selectedAppointment?.doctors[0]?.doctor.user.name} at{' '}
            {selectedAppointment?.clinic.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            No
          </Button>
          <Button onClick={confirmCancel} color='secondary'>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModifyDialog} onClose={handleClose}>
        <DialogTitle>Modify Appointment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type='date'
            label='New Date'
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            variant='outlined'
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type='time'
            label='New Time'
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            variant='outlined'
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as string)}
              label='Status'
            >
              <MenuItem value='PENDING'>PENDING</MenuItem>
              <MenuItem value='CONFIRMED'>CONFIRMED</MenuItem>
              <MenuItem value='CANCELLED'>CANCELLED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={confirmModify} color='primary'>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAppointments;
