import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Accounts from './Accounts'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems } from './listItems';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Deposits from './Deposits';
import Orders from './Orders';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import { stringify } from 'querystring';
import HorizontalBarChart from './HorizontalBarChart';
import {
    usePlaidLink,
    PlaidLinkOptions,
    PlaidLinkOnSuccess,
  } from 'react-plaid-link';
interface Budgets {
    food: number;
    shopping: number;
    recreation: number;
    utilities: number;
    other: number;
    travel: number;
  }
interface IPROPS{
    uid: string
}
let Budget: React.FC<IPROPS>= ({uid}) => {
    const [opens, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!opens);
    };
    const [budgets, setBudgets] = useState<Budgets>({
        food: 0,
        shopping: 0,
        recreation: 0,
        travel:0,
        utilities: 0,
        other: 0,
      });
    
      const handleBudgetChange = (category: keyof Budgets, value: string) => {
        setBudgets(prevBudgets => ({
          ...prevBudgets,
          [category]: parseFloat(value) || 0,
        }));
      };
      const saveBudget = () => {
        fetch('/set_budget',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:uid, food: budgets.food, shopping: budgets.shopping, recreation: budgets.recreation, travel: budgets.travel, utilities:budgets.utilities, other:budgets.other})
        })
      }
    
        const drawerWidth: number = 240;

        interface AppBarProps extends MuiAppBarProps {
          open?: boolean;
        }
        const AppBar = styled(MuiAppBar, {
          shouldForwardProp: (prop) => prop !== 'open',
        })<AppBarProps>(({ theme, open }) => ({
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }));
        
        const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
          ({ theme, open }) => ({
            '& .MuiDrawer-paper': {
              position: 'relative',
              whiteSpace: 'nowrap',
              width: drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxSizing: 'border-box',
              ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                  width: theme.spacing(9),
                },
              }),
            },
          }),
        );
        
        const mdTheme = createTheme();
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={opens} style={{height:"50px"}}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(opens && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Budgeting Manager
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={opens}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [2],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
            <Grid container spacing={1}>
              {/* Recent Deposits */}
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <div>
      <h1>Budgeting Page</h1>
      <div>
        <label htmlFor="food">Food:</label>
        <input
          type="number"
          id="food"
          value={budgets.food}
          onChange={(e) => handleBudgetChange('food', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="shopping">Shopping:</label>
        <input
          type="number"
          id="shopping"
          value={budgets.shopping}
          onChange={(e) => handleBudgetChange('shopping', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="recreation">Recreation:</label>
        <input
          type="number"
          id="recreation"
          value={budgets.recreation}
          onChange={(e) => handleBudgetChange('recreation', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="utilities">Utilities:</label>
        <input
          type="number"
          id="utilities"
          value={budgets.utilities}
          onChange={(e) => handleBudgetChange('utilities', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="travel">Travel:</label>
        <input
          type="number"
          id="travel"
          value={budgets.travel}
          onChange={(e) => handleBudgetChange('travel', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="other">Other:</label>
        <input
          type="number"
          id="other"
          value={budgets.other}
          onChange={(e) => handleBudgetChange('other', e.target.value)}
        />
      </div>
      <div>
        <h2>Entered Budgets:</h2>
        <ul>
          {Object.entries(budgets).map(([category, value]) => (
            <li key={category}>
              {category}: {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Button variant="contained" onClick={() => saveBudget()}>Save Changes</Button>
                </Paper>
            </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
    

  )
}

export default Budget
