import * as React from 'react';
import {useState,useEffect} from 'react'
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
import Link from '@mui/material/Link';
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

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
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

interface IPROPS{
    uid: string
}

let DashboardContent: React.FC<IPROPS> = ({uid}) => {
    const [month,setMonth] = useState(12)
    const [year,setYear] = useState(2022)
    const [label,setLabel] = useState<any[]>([])
    const [moneyData,setMoneyData]=useState<any[]>([])
    const[transactions,setTransactions] = useState([])
    const[categories,setCategories] = useState(new Map())
    const[prevCategories,setPrevCategories] = useState<any[]>([])
    const [lastMonth, setLastMonth] = useState(month==1?12:month-1)
    const[lastYear, setLastYear] = useState(month==1?year-1:year)
    const [pMonth, setPMonth] = useState(lastMonth==1?12:lastMonth-1)
    const[pYear, setPYear] = useState(lastMonth==1?lastYear-1:lastYear)
    const[cMoneyData,setcMoneyData] = useState<any[]>([])
    useEffect(() =>{
        fetch('/transactions/get',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:uid, month:month, year: year})
        })
        .then((res) =>res.json())
        .then((data) =>{
            setTransactions(data["transactions"])
            setCategories((data["categories"]))
            console.log(data)
            setLabel([])
            setMoneyData([])
            for(let[key,value] of Object.entries(data["categories"])){
                setLabel(label =>[
                    ...label,key
                ])
                setMoneyData(moneyData =>[
                    ...moneyData,value
                ])
            }
            if (data["overBudget"])
              alert("You have went over your set budget this month")
        })
        fetch('/transactions/get',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:uid, month:lastMonth, year: lastYear})
        })
        .then((res) =>res.json())
        .then((data) =>{
            setPrevCategories([])
            for(let[key,value] of Object.entries(data["categories"])){
                setPrevCategories(prevCategories =>[
                    ...prevCategories,value
                ])
            }
        })
        fetch('/transactions/get',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:uid, month:pMonth, year: pYear})
        })
        .then((res) =>res.json())
        .then((data) =>{
            setcMoneyData([])
            for(let[key,value] of Object.entries(data["categories"])){
                setcMoneyData(cMoneyData =>[
                    ...cMoneyData,value
                ])
            }
        })
    },[month,year])
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const handleChange = (event: SelectChangeEvent) => {
        let m = Number(event.target.value)
        setLastMonth(m==1?12:m-1)
        setLastYear(m==1?year-1:year)
        setPMonth(m==1?11:m==2?12:m-2)
        setPYear(m<=2?year-1:year)
        setMonth(m);
      };
      const yearhandleChange = (event: SelectChangeEvent) => {
        setLastYear(month==1?Number(event.target.value)-1:Number(event.target.value))
        setPYear(month<=2?Number(event.target.value)-1:Number(event.target.value))
        setYear(Number(event.target.value));
      };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} style={{height:"50px"}}>
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
                ...(open && { display: 'none' }),
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
              Finance Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
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
          <div style={{marginTop: '-30px'}}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 40 }}>
                    <InputLabel id="demo-simple-select-standard-label">Month</InputLabel>
                    <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={month.toString()}
                    onChange={handleChange}
                    label="Month"
                    >
                    <MenuItem value={month}>
                        <em>{month}</em>
                    </MenuItem>
                    <MenuItem value={1}>01</MenuItem>
                    <MenuItem value={2}>02</MenuItem>
                    <MenuItem value={3}>03</MenuItem>
                    <MenuItem value={4}>04</MenuItem>
                    <MenuItem value={5}>05</MenuItem>
                    <MenuItem value={6}>06</MenuItem>
                    <MenuItem value={7}>07</MenuItem>
                    <MenuItem value={8}>08</MenuItem>
                    <MenuItem value={9}>09</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={11}>11</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                    <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
                    <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={year.toString()}
                    onChange={yearhandleChange}
                    label="Month"
                    >
                    <MenuItem value={year}>
                        <em>{year}</em>
                    </MenuItem>
                    <MenuItem value={2018}>2018</MenuItem>
                    <MenuItem value={2019}>2019</MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                    <MenuItem value={2022}>2022</MenuItem>
                    <MenuItem value={2023}>2023</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Grid container spacing={0.5}>
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <DoughnutChart moneyData={moneyData} labels={label}></DoughnutChart>
                </Paper>
              </Grid>
            <Grid item xs={12} md={4} lg={5}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <BarChart moneyData={moneyData} labels={label} prevCategories={prevCategories}></BarChart>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <HorizontalBarChart currMonth={month} prevMonth={lastMonth} pMonth={pMonth} aMoneyData={moneyData} bMoneyData={prevCategories} cMoneyData={cMoneyData}></HorizontalBarChart>
                </Paper>
              </Grid>
              
    
              {/* Recent Deposits */}
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders transactions={transactions}/>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DashboardContent