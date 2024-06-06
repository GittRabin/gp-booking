'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Clinic, DoctorWithUser, Patient, Appointment } from '../types';

const AdminDashboard: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithUser[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [clinicForm, setClinicForm] = useState<Partial<Clinic>>({
    name: '',
    location: '',
  });
  const [doctorForm, setDoctorForm] = useState<{
    name: string;
    location: string;
    email: string;
    password: string;
  }>({ name: '', location: '', email: '', password: '' });
  const [patientForm, setPatientForm] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: '', email: '', password: '' });
  const [appointmentForm, setAppointmentForm] = useState<{
    doctorId: string;
    patientId: string;
    clinicId: string;
    date: string;
    time: string;
  }>({ doctorId: '', patientId: '', clinicId: '', date: '', time: '' });

  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    fetchData('/api/admin/clinics', setClinics);
    fetchData('/api/admin/doctors', setDoctors);
    fetchData('/api/admin/patients', setPatients);
    fetchData('/api/admin/appointments', setAppointments);
  }, []);

  const fetchData = async (
    url: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const response = await fetch(url);
    const data = await response.json();
    setState(data);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    form: any,
    setForm: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    url: string,
    form: any,
    setForm: React.Dispatch<React.SetStateAction<any>>,
    setState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    event.preventDefault();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    const newItem = await response.json();
    setState((prev) => [...prev, newItem]);
    setForm({});
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
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
    <Container>
      <Typography variant='h4' gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label='admin dashboard tabs'
      >
        <Tab label='Clinics' />
        <Tab label='Doctors' />
        <Tab label='Patients' />
        <Tab label='Appointments' />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Add Clinic
              </Typography>
              <form
                onSubmit={(event) =>
                  handleSubmit(
                    event,
                    '/api/admin/clinics',
                    clinicForm,
                    setClinicForm,
                    setClinics
                  )
                }
              >
                <TextField
                  name='name'
                  label='Name'
                  value={clinicForm.name}
                  onChange={(event) =>
                    handleInputChange(event, clinicForm, setClinicForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='location'
                  label='Location'
                  value={clinicForm.location}
                  onChange={(event) =>
                    handleInputChange(event, clinicForm, setClinicForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <Button type='submit' variant='contained' color='primary'>
                  Add Clinic
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Clinics List
            </Typography>
            <Paper sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clinics.map((clinic) => (
                      <TableRow key={clinic.id}>
                        <TableCell>{clinic.name}</TableCell>
                        <TableCell>{clinic.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Add Doctor
              </Typography>
              <form
                onSubmit={(event) =>
                  handleSubmit(
                    event,
                    '/api/admin/doctors',
                    doctorForm,
                    setDoctorForm,
                    setDoctors
                  )
                }
              >
                <TextField
                  name='name'
                  label='Name'
                  value={doctorForm.name}
                  onChange={(event) =>
                    handleInputChange(event, doctorForm, setDoctorForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='location'
                  label='Location'
                  value={doctorForm.location}
                  onChange={(event) =>
                    handleInputChange(event, doctorForm, setDoctorForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='email'
                  label='Email'
                  value={doctorForm.email}
                  onChange={(event) =>
                    handleInputChange(event, doctorForm, setDoctorForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='password'
                  label='Password'
                  type='password'
                  value={doctorForm.password}
                  onChange={(event) =>
                    handleInputChange(event, doctorForm, setDoctorForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <Button type='submit' variant='contained' color='primary'>
                  Add Doctor
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Doctors List
            </Typography>
            <Paper sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>{doctor.name}</TableCell>
                        <TableCell>{doctor.location}</TableCell>
                        <TableCell>{doctor.user.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Add Patient
              </Typography>
              <form
                onSubmit={(event) =>
                  handleSubmit(
                    event,
                    '/api/admin/patients',
                    patientForm,
                    setPatientForm,
                    setPatients
                  )
                }
              >
                <TextField
                  name='name'
                  label='Name'
                  value={patientForm.name}
                  onChange={(event) =>
                    handleInputChange(event, patientForm, setPatientForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='email'
                  label='Email'
                  value={patientForm.email}
                  onChange={(event) =>
                    handleInputChange(event, patientForm, setPatientForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='password'
                  label='Password'
                  type='password'
                  value={patientForm.password}
                  onChange={(event) =>
                    handleInputChange(event, patientForm, setPatientForm)
                  }
                  fullWidth
                  margin='normal'
                />
                <Button type='submit' variant='contained' color='primary'>
                  Add Patient
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Patients List
            </Typography>
            <Paper sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Add Appointment
              </Typography>
              <form
                onSubmit={(event) =>
                  handleSubmit(
                    event,
                    '/api/admin/appointments',
                    appointmentForm,
                    setAppointmentForm,
                    setAppointments
                  )
                }
              >
                <TextField
                  name='doctorId'
                  label='Doctor ID'
                  value={appointmentForm.doctorId}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      appointmentForm,
                      setAppointmentForm
                    )
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='patientId'
                  label='Patient ID'
                  value={appointmentForm.patientId}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      appointmentForm,
                      setAppointmentForm
                    )
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='clinicId'
                  label='Clinic ID'
                  value={appointmentForm.clinicId}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      appointmentForm,
                      setAppointmentForm
                    )
                  }
                  fullWidth
                  margin='normal'
                />
                <TextField
                  name='date'
                  label='Date'
                  type='date'
                  value={appointmentForm.date}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      appointmentForm,
                      setAppointmentForm
                    )
                  }
                  fullWidth
                  margin='normal'
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name='time'
                  label='Time'
                  type='time'
                  value={appointmentForm.time}
                  onChange={(event) =>
                    handleInputChange(
                      event,
                      appointmentForm,
                      setAppointmentForm
                    )
                  }
                  fullWidth
                  margin='normal'
                  InputLabelProps={{ shrink: true }}
                />
                <Button type='submit' variant='contained' color='primary'>
                  Add Appointment
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Appointments List
            </Typography>
            <Paper sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Clinic</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default AdminDashboard;
