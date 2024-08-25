import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
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
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import apiService from '../apiService';

const Navigation = ({ isAuthenticated, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const location = useLocation();

  const projectId = location.pathname.startsWith('/flow/')
    ? location.pathname.split('/')[2]
    : null;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await apiService.getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const projectsList = await apiService.fetchProjects();
        setProjects(projectsList);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserInfo();
      fetchProjects();
    }
  }, [isAuthenticated]);

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

  const menuItems = [
    { text: 'Projects', icon: <FolderIcon />, path: '/' },
    { text: 'Secrets', icon: <FolderIcon />, path: '/secrets' },
    // Add more menu items as needed
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={onLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </Box>
  );

  const getTitle = () => {
    if (currentProject) {
      return currentProject.name;
    }
    return location.pathname === '/' ? 'Projects' : 'Platform';
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
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                cursor: currentProject ? 'pointer' : 'default',
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
            <Avatar
              alt={userInfo.name}
              src={userInfo.avatar}
              sx={{ width: 40, height: 40 }}
            />
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation;
