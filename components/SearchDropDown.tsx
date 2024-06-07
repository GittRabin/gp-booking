'use client';

import React from 'react';
import { Paper, List, ListItem, ListItemText } from '@mui/material';

type Clinic = {
  id: string;
  name: string;
  location: string;
};

type Doctor = {
  id: string;
  name: string;
  email: string;
  clinicId: string;
};

type SearchDropdownProps = {
  open: boolean;
  filter: string;
  onSelect: (item: string) => void;
  clinics: Clinic[];
  doctors: Doctor[];
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  open,
  filter,
  onSelect,
  clinics,
  doctors,
}) => {
  if (!open || (!clinics && !doctors)) return null;

  const filteredClinics =
    clinics?.filter((clinic) =>
      clinic.name.toLowerCase().includes(filter.toLowerCase())
    ) || [];
  const filteredDoctors =
    doctors?.filter((doctor) =>
      doctor.name.toLowerCase().includes(filter.toLowerCase())
    ) || [];

  return (
    <Paper style={{ position: 'absolute', width: '100%', zIndex: 1 }}>
      <List>
        {filteredClinics.map((clinic) => (
          <ListItem
            button
            key={clinic.id}
            onClick={() => onSelect(clinic.name)}
          >
            <ListItemText primary={clinic.name} secondary={clinic.location} />
          </ListItem>
        ))}
        {filteredDoctors.map((doctor) => (
          <ListItem
            button
            key={doctor.id}
            onClick={() => onSelect(doctor.name)}
          >
            <ListItemText
              primary={doctor.name}
              secondary={`Email: ${doctor.email}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SearchDropdown;
