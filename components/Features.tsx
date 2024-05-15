'use client';

import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import GeneralPractitionerIcon from '@mui/icons-material/LocalHospital';
import TelehealthIcon from '@mui/icons-material/PhoneInTalk';
import PhysiotherapistIcon from '@mui/icons-material/FitnessCenter';
import DentistIcon from '@mui/icons-material/Mood';
import PsychologistIcon from '@mui/icons-material/Psychology';
import OptometristIcon from '@mui/icons-material/Visibility';
import ChiropractorIcon from '@mui/icons-material/AcUnit';
import PodiatristIcon from '@mui/icons-material/DirectionsWalk';

const features = [
  { icon: <GeneralPractitionerIcon />, title: 'General Practitioner' },
  { icon: <TelehealthIcon />, title: 'GP Telehealth' },
  { icon: <PhysiotherapistIcon />, title: 'Physiotherapist' },
  { icon: <DentistIcon />, title: 'Dentist' },
  { icon: <PsychologistIcon />, title: 'Psychologist' },
  { icon: <OptometristIcon />, title: 'Optometrist' },
  { icon: <ChiropractorIcon />, title: 'Chiropractor' },
  { icon: <PodiatristIcon />, title: 'Podiatrist' },
];

const Features = () => {
  return (
    <Container maxWidth='lg' sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              {feature.icon}
              <Typography variant='h6' component='h3' sx={{ mt: 2 }}>
                {feature.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features;
