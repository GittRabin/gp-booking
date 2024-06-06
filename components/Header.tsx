'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PracticeIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Logo from './Logo';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { data: session } = useSession();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLoginRedirect = () => {
    router.push('/auth/signin');
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    signOut();
  };

  const formatNameAndEmail = (name: string, email: string) => {
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    return `${formattedName} (${email})`;
  };

  return (
    <AppBar position='static' color='default'>
      <Container maxWidth='lg'>
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo />
          {isMobile ? (
            <>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor='right'
                open={drawerOpen}
                onClose={handleDrawerToggle}
                transitionDuration={250} // smoother transitions
              >
                <List>
                  <ListItem>
                    <Typography
                      variant='subtitle2'
                      component='h2'
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      List your practice
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon />
                    </ListItemIcon>
                    <ListItemText primary='Search' />
                  </ListItem>
                  {!session ? (
                    <ListItem button onClick={handleLoginRedirect}>
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText primary='Log in / Sign up' />
                    </ListItem>
                  ) : (
                    <ListItem button onClick={handleProfileMenuOpen}>
                      <ListItemText primary={session.user?.email} />
                    </ListItem>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button sx={{ textTransform: 'none' }}>
                  <Typography
                    variant='subtitle2'
                    component='h2'
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    List your practice
                  </Typography>
                </Button>
                <Button sx={{ textTransform: 'none' }}>
                  <Typography
                    variant='subtitle2'
                    component='h2'
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Search
                  </Typography>
                </Button>
                {!session ? (
                  <Button
                    startIcon={<LoginIcon />}
                    sx={{ textTransform: 'none' }}
                    onClick={handleLoginRedirect}
                  >
                    <Typography
                      variant='subtitle2'
                      component='h2'
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      Log in / Sign up
                    </Typography>
                  </Button>
                ) : (
                  <>
                    <IconButton onClick={handleProfileMenuOpen}>
                      <Avatar
                        alt={session.user?.name || 'User'}
                        src={session.user?.image || ''}
                      />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleProfileMenuClose}
                    >
                      <MenuItem>
                        <Box
                          display='flex'
                          alignItems='center'
                          flexDirection='column'
                        >
                          <Avatar
                            alt={session.user?.name || 'User'}
                            src={session.user?.image || ''}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant='subtitle1'>
                            {session.user?.name
                              ? formatNameAndEmail(
                                  session.user.name,
                                  session.user.email
                                )
                              : ''}
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
