'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

import { Box, Button, Container } from '@mui/material';

const DashboardView = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated') {
      const { roles } = session?.user ?? {};

      if (roles.isDoctor) {
        setDashboard('doctor');
      }

      if (roles.isPatient) {
        setDashboard('patient');
      }

      if (roles.isAdmin) {
        setDashboard('admin');
      }

      if (
        roles.isDoctor === false &&
        roles.isPatient === false &&
        roles.isAdmin === false
      ) {
        router.push('/auth/signin');
      }
    }
  }, [status, session, router]);

  const handleToggleDashboard = (role: string) => {
    setDashboard(role);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Box sx={{ mt: 8 }}>
        {dashboard === 'doctor' && <DoctorDashboard />}
        {dashboard === 'patient' && <PatientDashboard />}
        {dashboard === 'admin' && <AdminDashboard />}
      </Box>
      {/* <Box sx={{ mt: 4 }}>
        {session?.user.roles.isDoctor && (
          <Button
            variant='contained'
            onClick={() => handleToggleDashboard('doctor')}
          >
            Doctor Dashboard
          </Button>
        )}
        {session?.user.roles.isPatient && (
          <Button
            variant='contained'
            onClick={() => handleToggleDashboard('patient')}
          >
            Patient Dashboard
          </Button>
        )}
        {session?.user.roles.isAdmin && (
          <Button
            variant='contained'
            onClick={() => handleToggleDashboard('admin')}
          >
            Admin Dashboard
          </Button>
        )}
      </Box> */}
    </Container>
  );
};

export default DashboardView;
