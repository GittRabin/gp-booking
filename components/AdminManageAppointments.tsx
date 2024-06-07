'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  DialogContentText,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { Doctor, Clinic, Patient } from '@prisma/client';

type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'COMPLETED';

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
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

const AdminManageAppointments: React.FC = () => {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('PENDING');
  const [appointmentForm, setAppointmentForm] = useState<{
    doctorId: string;
    patientId: string;
    clinicId: string;
    date: string;
    time: string;
  }>({ doctorId: '', patientId: '', clinicId: '', date: '', time: '' });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    };

    const fetchDoctors = async () => {
      const response = await fetch('/api/doctors');
      const data: Doctor[] = await response.json();
      setDoctors(data);
    };

    const fetchClinics = async () => {
      const response = await fetch('/api/clinics');
      const data: Clinic[] = await response.json();
      setClinics(data);
    };

    const fetchPatients = async () => {
      const response = await fetch('/api/admin/patients');
      const data: Patient[] = await response.json();
      setPatients(data);
    };

    fetchAppointments();
    fetchDoctors();
    fetchClinics();
    fetchPatients();
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
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedAppointment.id,
          status: 'CANCELLED',
        }),
      });

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
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedAppointment.id,
          date: newDate,
          time: newTime,
          status: newStatus,
        }),
      });

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

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const confirmAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/admin/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentForm),
    });

    if (response.ok) {
      const newAppointment = await response.json();
      setAppointments((prev) => [...prev, newAppointment]);
      setOpenAddDialog(false);
      setAppointmentForm({
        doctorId: '',
        patientId: '',
        clinicId: '',
        date: '',
        time: '',
      });
    } else {
      alert('Failed to add appointment');
    }
  };

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
    form: any,
    setForm: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
    setOpenModifyDialog(false);
    setOpenAddDialog(false);
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
      <Button variant='contained' color='primary' onClick={handleAdd}>
        Add Appointment
      </Button>
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

      <Dialog fullWidth open={openModifyDialog} onClose={handleClose}>
        <DialogTitle>Modify Appointment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type='date'
            label='New Date'
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            variant='outlined'
            sx={{ mb: 4 }}
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
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as AppointmentStatus)
              }
              label='Status'
            >
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='CONFIRMED'>Confirmed</MenuItem>
              <MenuItem value='CANCELLED'>Cancelled</MenuItem>
              <MenuItem value='RESCHEDULED'>Rescheduled</MenuItem>
              <MenuItem value='COMPLETED'>Completed</MenuItem>
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

      <Dialog fullWidth open={openAddDialog} onClose={handleClose}>
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent>
          <form onSubmit={confirmAdd}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name='doctorId'
                    value={appointmentForm.doctorId}
                    onChange={(e) =>
                      handleInputChange(e, appointmentForm, setAppointmentForm)
                    }
                    label='Doctor'
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.user.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Patient</InputLabel>
                  <Select
                    name='patientId'
                    value={appointmentForm.patientId}
                    onChange={(e) =>
                      handleInputChange(e, appointmentForm, setAppointmentForm)
                    }
                    label='Patient'
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.user.name} ({patient.user.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>Clinic</InputLabel>
                  <Select
                    name='clinicId'
                    value={appointmentForm.clinicId}
                    onChange={(e) =>
                      handleInputChange(e, appointmentForm, setAppointmentForm)
                    }
                    label='Clinic'
                  >
                    {clinics.map((clinic) => (
                      <MenuItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='date'
                  label='Date'
                  name='date'
                  value={appointmentForm.date}
                  onChange={(e) =>
                    handleInputChange(e, appointmentForm, setAppointmentForm)
                  }
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='time'
                  label='Time'
                  name='time'
                  value={appointmentForm.time}
                  onChange={(e) =>
                    handleInputChange(e, appointmentForm, setAppointmentForm)
                  }
                  variant='outlined'
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button type='submit' color='primary'>
                Add Appointment
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminManageAppointments;
