'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
} from '@mui/material';
import { Patient } from '@prisma/client';

type PatientForm = {
  name: string;
  email: string;
  password: string;
};

const AdminManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientForm, setPatientForm] = useState<PatientForm>({
    name: '',
    email: '',
    password: '',
  });

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('/api/admin/patients');
      const data: Patient[] = await response.json();
      setPatients(data);
    };

    fetchPatients();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    form: PatientForm,
    setForm: React.Dispatch<React.SetStateAction<PatientForm>>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    url: string,
    form: PatientForm,
    setForm: React.Dispatch<React.SetStateAction<PatientForm>>,
    setState: React.Dispatch<React.SetStateAction<Patient[]>>
  ) => {
    event.preventDefault();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    const newItem: Patient = await response.json();
    setState((prev) => [...prev, newItem]);
    setForm({ name: '', email: '', password: '' });
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenDialog}
          >
            Add Patient
          </Button>
          <Paper sx={{ p: 3, mt: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last modified</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.user.name}</TableCell>
                      <TableCell>{patient.user.email}</TableCell>
                      <TableCell>
                        {formatDate(patient.user.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatDate(patient.user.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Patient</DialogTitle>
        <DialogContent>
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
            <DialogActions>
              <Button onClick={handleCloseDialog} color='primary'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary'>
                Add Patient
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminManagePatients;
