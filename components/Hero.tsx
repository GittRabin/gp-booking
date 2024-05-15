'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Hidden,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LocationOn } from '@mui/icons-material';

const Hero = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
      <Container maxWidth='lg'>
        <Typography
          variant='h3'
          component='h1'
          gutterBottom
          textAlign={{ xs: 'center', md: 'left' }}
        >
          Book your next healthcare appointment
        </Typography>
        <Typography
          variant='h6'
          color='textSecondary'
          paragraph
          textAlign={{ xs: 'center', md: 'left' }}
        >
          Find, book and add your favourite practitioners to your care team.
        </Typography>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            padding: 2,
            gap: 1,
            mt: 4,
            // backgroundColor: '#e1e2e6',
          }}
        >
          <TextField
            fullWidth
            placeholder='Service, practice or practitioner'
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            placeholder='Suburb or postcode'
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LocationOn />
                </InputAdornment>
              ),
            }}
          />
          <Hidden mdUp>
            <Button
              variant='contained'
              color='primary'
              sx={{
                width: '100%',
              }}
            >
              Search
            </Button>
          </Hidden>
          <Hidden mdDown>
            <Button
              variant='contained'
              color='primary'
              sx={{
                minWidth: 120, // Ensuring the width aligns with other input fields
                height: 56, // Match the height of the TextFields
                borderRadius: '4px', // Match the border radius of the TextFields
                margin: '0 8px', // Consistent spacing
              }}
            >
              <SearchIcon />
            </Button>
          </Hidden>
        </Paper>
      </Container>
    </Box>
  );
};

export default Hero;
