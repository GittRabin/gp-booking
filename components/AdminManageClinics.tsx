'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
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

type Clinic = {
  id: string;
  name: string;
  location: string;
};

type ClinicForm = {
  name: string;
  location: string;
};

const AdminManageClinics: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicForm, setClinicForm] = useState<ClinicForm>({
    name: '',
    location: '',
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch('/api/admin/clinics');
        if (!response.ok) {
          throw new Error('Failed to fetch clinics');
        }
        const data = await response.json();
        setClinics(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClinics();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    setForm: React.Dispatch<React.SetStateAction<ClinicForm>>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    form: ClinicForm,
    setForm: React.Dispatch<React.SetStateAction<ClinicForm>>,
    setState: React.Dispatch<React.SetStateAction<Clinic[]>>
  ) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/admin/clinics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('Failed to add clinic');
      }
      const newItem = await response.json();
      setState((prev) => [...prev, newItem]);
      setForm({ name: '', location: '' });
      setOpenAddDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClinic = () => {
    setOpenAddDialog(true);
  };

  const handleClose = () => {
    setOpenAddDialog(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Button variant='contained' color='primary' onClick={handleAddClinic}>
        Add Clinic
      </Button>
      <Paper sx={{ p: 3, mt: 3 }}>
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

      <Dialog open={openAddDialog} onClose={handleClose}>
        <DialogTitle>Add Clinic</DialogTitle>
        <DialogContent>
          <form
            onSubmit={(event) =>
              handleSubmit(event, clinicForm, setClinicForm, setClinics)
            }
          >
            <TextField
              name='name'
              label='Name'
              value={clinicForm.name}
              onChange={(event) => handleInputChange(event, setClinicForm)}
              fullWidth
              margin='normal'
            />
            <TextField
              name='location'
              label='Location'
              value={clinicForm.location}
              onChange={(event) => handleInputChange(event, setClinicForm)}
              fullWidth
              margin='normal'
            />
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button type='submit' color='primary'>
                Add Clinic
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminManageClinics;
