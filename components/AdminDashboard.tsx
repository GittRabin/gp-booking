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
import AdminManageAppointment from '@/components/AdminManageAppointments';
import AdminManageDoctors from '@/components/AdminManageDoctors';
import AdminManageClinics from '@/components/AdminManageClinics';
import AdminManagePatients from '@/components/AdminManagePatients';

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
        <AdminManageClinics />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <AdminManageDoctors />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <AdminManagePatients />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <AdminManageAppointment />
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
