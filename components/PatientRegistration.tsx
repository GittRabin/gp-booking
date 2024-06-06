'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

const PatientRegistration: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [role, setRole] = useState<string>('patient'); // ['patient', 'doctor'
  const router = useRouter();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setError('');
    setSuccess('');
  };

  const handleSignInSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess('Successfully logged in!');
      router.push('/dashboard');
    }
  };

  const handleSignUpSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sign up');
      }

      setSuccess('Successfully signed up!');
      router.push('/dashboard');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ mt: 8 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          {tabIndex === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label='auth tabs'
        >
          <Tab label='Sign In' />
          <Tab label='Sign Up' />
        </Tabs>
        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}
        <TabPanel value={tabIndex} index={0}>
          <form onSubmit={handleSignInSubmit}>
            <TextField
              label='Email'
              type='email'
              fullWidth
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label='Password'
              type='password'
              fullWidth
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Typography variant='body2' align='center'>
              Forgot password?{' '}
              <Link href='/auth/reset-password' underline='hover'>
                Reset Password
              </Link>
            </Typography>
          </Box>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <form onSubmit={handleSignUpSubmit}>
            <TextField
              label='Name'
              type='name'
              fullWidth
              margin='normal'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label='Email'
              type='email'
              fullWidth
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label='Password'
              type='password'
              fullWidth
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label='Confirm Password'
              type='password'
              fullWidth
              margin='normal'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </form>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default PatientRegistration;
