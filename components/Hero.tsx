'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Hidden,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchDropdown from './SearchDropDown';

const Hero: React.FC = () => {
  const [input, setInput] = useState('');
  const [service, setService] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSearch = async () => {
    const query = new URLSearchParams();
    if (input) query.append('location', input);
    if (service) query.append('service', service);

    const response = await fetch(`/api/search?${query.toString()}`);
    const data = await response.json();
    setSearchResults(data.clinics || []);
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setService(event.target.value);
    setDropdownOpen(event.target.value !== '');
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth='lg'>
        <Typography
          variant='h3'
          component='h1'
          gutterBottom
          textAlign={{ xs: 'center', md: 'center' }}
        >
          Book your next healthcare appointment
        </Typography>
        <Typography
          variant='h6'
          color='textSecondary'
          paragraph
          textAlign={{ xs: 'center', md: 'center' }}
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
          }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <TextField
              fullWidth
              placeholder='Service, practice or practitioner'
              variant='outlined'
              value={service}
              onChange={handleServiceChange}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <SearchDropdown
              open={dropdownOpen}
              filter={service}
              onSelect={(item) => setService(item)}
            />
          </div>
          <TextField
            fullWidth
            placeholder='Suburb or postcode'
            value={input}
            onChange={handleInputChange}
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LocationOnIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleSearch} edge='end'>
                    <MyLocationIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Hidden mdUp>
            <Button
              variant='contained'
              color='primary'
              sx={{ width: '100%' }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Hidden>
          <Hidden mdDown>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSearch}
              sx={{
                minWidth: 120,
                height: 56,
                borderRadius: '4px',
                margin: '0 8px',
              }}
            >
              <SearchIcon />
            </Button>
          </Hidden>
        </Paper>
        <Box mt={4}>
          {searchResults.length > 0 && (
            <Paper sx={{ padding: 2, width: '100%' }}>
              <List>
                {searchResults.map((clinic: any) => (
                  <ListItem
                    button
                    key={clinic.id}
                    onClick={() => {
                      // Redirect logic here, e.g., router.push(`/clinic/${clinic.id}`)
                      window.location.href = `/clinic/${clinic.id}`;
                    }}
                  >
                    <ListItemText
                      primary={`${clinic.name} - ${clinic.location}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
