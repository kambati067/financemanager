import * as React from 'react';
import {Link} from 'react-router-dom'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
export const mainListItems = (
  <React.Fragment>
    <Link to="/link">
      <ListItemButton>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Account Manager" />
      </ListItemButton>
    </Link>
    <Link to="/dashboard">
      <ListItemButton>
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <ListItemText primary="Finance Dashboard" />
      </ListItemButton>
    </Link>
    <Link to="/budget">
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Budgeting Manager" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

