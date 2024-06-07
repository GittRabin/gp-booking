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
} from '@mui/material';

type Doctor = {
  id: string;
  name: string;
  location: string;
  user: {
    email: string;
  };
};

type DoctorForm = {
  name: string;
  location: string;
  email: string;
  password: string;
};

const AdminManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorForm, setDoctorForm] = useState<DoctorForm>({
    name: '',
    location: '',
    email: '',
    password: '',
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch('/api/admin/doctors');
      const data = await response.json();
      setDoctors(data);
    };

    fetchDoctors();
  }, []);

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
    setOpenAddDialog(false);
  };

  const handleAddDoctor = () => {
    setOpenAddDialog(true);
  };

  const handleClose = () => {
    setOpenAddDialog(false);
  };

  return (
    <Container>
      <Button variant='contained' color='primary' onClick={handleAddDoctor}>
        Add Doctor
      </Button>
      <Paper sx={{ p: 3, mt: 3 }}>
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

      <Dialog open={openAddDialog} onClose={handleClose}>
        <DialogTitle>Add Doctor</DialogTitle>
        <DialogContent>
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
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button type='submit' color='primary'>
                Add Doctor
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminManageDoctors;
