import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Router from "next/router";
import csrf from "../utils/cerf";
import styles from '/styles/Nav.module.css';
import User from "../utils/server_side_user";


export async function getServerSideProps(context) {
    const {req, res} = context;
    await csrf(req, res);
    const user = await User(req, res);
    console.log(user);
    return {
        props: {csrfToken: req.csrfToken()},
    }
}


export default function Nav({csrfToken}) {
    const [log, setLog] = React.useState(false);
    const [user, setUser] = React.useState("");
    // temp validation just for display
    React.useEffect(() => {
        let tk = localStorage.getItem("username");
        if (tk !== null) {
            setUser(tk);
            setLog(true);
        } else {
            setLog(false);
        }
    }, []);


    const UserGreetings = (params) => {
        if (params.bool === true) {
            return (
                <div>
                    <Button color="inherit">Sir. {user}</Button>
                </div>
            )
        } else {
            return null;
        }
    }

    const logout = () => {
        const request = new Request('/api/logout', {
            headers: {'Content-Type': 'application/json', 'CSRF-Token': csrfToken}
        });
        fetch(request, {
            method: 'post',
            mode: "same-origin",
            body: JSON.stringify({})
        }).then(rsp => rsp.json()).then(() => {location.reload();});
    }

    const NavMainLogic = (params) => {
        if (params.bool) {
            return (
                <div>
                    <Button onClick={() => {
                        logout();
                        setLog(false);
                    }} color="inherit">Logout</Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button onClick={() => {
                        Router.push('/login')
                    }} color="inherit">Login</Button>
                    <Button onClick={() => {
                        Router.push('/register');
                    }} color="inherit">Register</Button>
                </div>
            );
        }
    }

    const [menu, setMenu] = React.useState(false);

    const horizontalMenuExpand = () => {
        if (!menu) {
            setMenu(true);
        } else {
            setMenu(false);
        }
    }

    return (
        <div className={styles.navFonts}>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                            onClick={horizontalMenuExpand}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography onClick={() => {
                            Router.push('/')
                        }} variant="h6" style={{cursor: "pointer"}} component="div" sx={{flexGrow: 1}}>
                            Notes App
                        </Typography>
                        <UserGreetings bool={log}/>
                        <NavMainLogic bool={log}/>
                    </Toolbar>
                </AppBar>

            </Box>
            <br/>
            <div className={styles.horizontalNav} style={{display: menu ? 'block' : 'none'}}>
                <center>
                    <h3>Options {csrfToken}</h3>
                </center>
            </div>
        </div>
    )
}