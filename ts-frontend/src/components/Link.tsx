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
interface IPROPS{
    uid: string
}
let PlaidLink: React.FC<IPROPS> = ({uid}) => {
    const [token,setToken]=useState("")
    const [accounts, setAccounts] = useState([])
    const [newAcc, setnewAcc] = useState(0)
    const [newTrans,setnewTrans] = useState(0)
    const [itemId,setItemId] = useState("")
    const [accessToken,setAccessToken] = useState("")
    const [opens, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!opens);
    };
    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch('/create_link_token', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:uid})
            });
            const responseJSON = await response.json();
            console.log(responseJSON["link_token"])
            setToken(responseJSON["link_token"]);
        };
        createLinkToken();
    }, []);
    useEffect(() =>{
        fetch('/get_accounts', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:uid})
         })
         .then((res) => res.json())
         .then((data) => {
            console.log(data)
            setAccounts(data)
         })
    }, [newAcc])
    /*useEffect(() =>{
        if(newTrans!==0)
        {
            fetch('/transaction_sync', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:uid, item_id:itemId, access_token: accessToken})
             })
        }
        if(newTrans!==0)
        {
            fetch('/transaction_sync', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:uid, item_id:itemId, access_token: accessToken})
             })
        }
    },[newTrans])*/
    
    const config: PlaidLinkOptions = {
        onSuccess: (public_token, metadata) => {
            console.log("hi")
            fetch('/exchange_public_token',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id:uid, public_token:public_token, metadata: metadata})
            })
            .then((res) => res.json())
            .then((data) =>{
                setnewAcc(newAcc => newAcc+1)
                setItemId(data['item_id'])
                setAccessToken(data['access_token'])
                setnewTrans(newTrans => newTrans+1)
            })
            
        },
        token,
        };
        const { open, exit, ready } = usePlaidLink(config);
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
              Account Manager
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
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Button variant="contained" onClick={() => open()}>Connect a bank account</Button>
                </Paper>
            </Grid>
                 
               
              
              
    
              {/* Recent Deposits */}
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Accounts accounts={accounts}/>
                </Paper>
            </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
    

  )
}

export default PlaidLink
