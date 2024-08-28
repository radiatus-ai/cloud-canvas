import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import apiService from '../apiService';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/Auth';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: theme.palette.primary.main,
}));

const Navigation = ({ isAuthenticated, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  });
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const theme = useTheme();
  const { user } = useAuth();

  const projectId = location.pathname.startsWith('/flow/')
    ? location.pathname.split('/')[2]
    : null;

  useEffect(() => {
    if (user) {
      let defaultAvatar;
      switch (true) {
        case user.email.endsWith('will@radiatus.io'):
          defaultAvatar = 'https://avatars.githubusercontent.com/u/651833?v=4&size=64';
          break;
        case user.email.endsWith('mo@radiatus.io'):
          defaultAvatar = 'https://avatars.githubusercontent.com/u/13317653?v=4&size=64';
          break;
        case user.email.endsWith('eric@radiatus.io'):
          defaultAvatar = 'https://avatars.githubusercontent.com/u/9451328?v=4&size=64';
          break;
        case user.email.endsWith('ahmed@radiatus.io'):
        case user.email.endsWith('phil@radiatus.io'):
          defaultAvatar = 'https://avatars.githubusercontent.com/u/43769063?v=4&size=64';
          break;
        case user.email.endsWith('pradeep@radiatus.io'):
          defaultAvatar = 'https://avatars.githubusercontent.com/u/11217764?v=4&size=64';
          break;
        case user.email.endsWith('thomas@radiatus.io'):
          defaultAvatar = 'https://avatars.githubusercontent.com/u/5421738?v=4&size=64';
          break;

        default:
          defaultAvatar =
            'https://api.dicebear.com/9.x/personas/svg?seed=Casper';
      }

      setUserInfo({
        name: user.email,
        avatar: user.avatar || defaultAvatar,
      });
    }
  }, [user]);

  // todo: wire this up using the new clients
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const info = await apiService.getUserInfo();
  //       setUserInfo(info);
  //     } catch (error) {
  //       console.error('Failed to fetch user info:', error);
  //     }
  //   };

  //   const fetchProjects = async () => {
  //     try {
  //       const projectsList = await apiService.fetchProjects();
  //       setProjects(projectsList);
  //     } catch (error) {
  //       console.error('Failed to fetch projects:', error);
  //     }
  //   };

  //   if (isAuthenticated) {
  //     fetchUserInfo();
  //     fetchProjects();
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find((p) => p.id === projectId);
      setCurrentProject(project);
    } else {
      setCurrentProject(null);
    }
  }, [projectId, projects]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const menuItems = [
    { text: 'Projects', icon: <FolderSpecialIcon />, path: '/' },
    { text: 'Secrets', icon: <VpnKeyIcon />, path: '/secrets' },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        p: 2,
        height: '100%',
        backgroundColor: theme.palette.background.default,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <StyledListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
          >
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </StyledListItem>
        ))}
        <StyledListItem button onClick={toggleDarkMode}>
          <StyledListItemIcon>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </StyledListItemIcon>
          <ListItemText
            primary={`Lights ${darkMode ? 'On' : 'Off'}`}
            primaryTypographyProps={{ variant: 'h5' }}
          />
        </StyledListItem>
        <StyledListItem button onClick={onLogout}>
          <StyledListItemIcon>
            <LogoutIcon />
          </StyledListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{ variant: 'h5' }}
          />
        </StyledListItem>
      </List>
    </Box>
  );

  // todo: need to be consistent for the ux to be good
  const getTitle = () => {
    // if (currentProject) {
    //   return currentProject.name;
    // }
    // return location.pathname === '/' ? 'Projects' : 'Cloud Canvas';
    return 'CLOUD CANVAS';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Tooltip
            title={currentProject ? 'Click to switch projects' : ''}
            arrow
            placement="bottom-start"
            enterDelay={500}
            leaveDelay={200}
          >
            <Typography
              variant="h1"
              component="div"
              sx={{
                flexGrow: 1,
                cursor: currentProject ? 'pointer' : 'default',
                WebkitTextStroke: '1px',
                WebkitTextStrokeColor: theme.palette.divider,
                textShadow: `
                  -1px -1px 0 ${theme.palette.divider},
                  1px -1px 0 ${theme.palette.divider},
                  -1px 1px 0 ${theme.palette.divider},
                  1px 1px 0 ${theme.palette.divider}
                `,
                '&:hover': currentProject
                  ? {
                      textDecoration: 'underline',
                      textUnderlineOffset: '5px',
                    }
                  : {},
              }}
              onClick={currentProject ? handleMenuClick : undefined}
            >
              {getTitle()}
            </Typography>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {projects.map((project) => (
              <MenuItem
                key={project.id}
                onClick={handleMenuClose}
                component={RouterLink}
                to={`/flow/${project.id}`}
              >
                {project.name}
              </MenuItem>
            ))}
          </Menu>

          {userInfo && (
            <>
              <Tooltip title="User menu" arrow>
                <IconButton
                  // onClick={handleUserMenuClick}
                  size="large"
                  edge="end"
                  color="inherit"
                >
                  <Avatar
                    alt={userInfo.name}
                    src={userInfo.avatar}
                    sx={{ width: 40, height: 40 }}
                  >
                    {!userInfo.avatar && <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              {/* <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>My account</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu> */}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            boxShadow: theme.shadows[5],
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation;
