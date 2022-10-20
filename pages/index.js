import Nav from './nav.js';
import csrf from "../utils/cerf";
import * as React from 'react';
import Button from "@mui/material/Button";
import {MdSchool, MdOutlineManageAccounts} from 'react-icons/md';
import Router from "next/router";
import RedirectDecorator from "../utils/login_required";
import User from '../utils/server_side_user';
import Box from "@mui/material/Box";
import {TbNotes} from 'react-icons/tb';
import styles from '/styles/Home.module.css';
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";

export async function getServerSideProps(context) {
    // req.cookies is a server side cookie
    const {req, res} = context;
    await csrf(req, res);
    const auth = RedirectDecorator(req);
    let user_type = true;
    let jsxTemplate = [];

    if (auth) {
        return {
            redirect: {
                destination: "/login", permanent: false
            }
        }
    }
    const token = req.cookies['token'];
    if (token !== undefined) {
        const user = await User(req, res);
        if (!user) {
            return {
                redirect: {
                    destination: "/login", permanent: false
                }
            }
        }


        const userType = user['student'];
        if (userType === false) {

            const Channels = async () => {
                const created_class_room = user['ClassRoom'];
                if (created_class_room.length > 0 && jsxTemplate.length === 0) {
                    jsxTemplate[0] = created_class_room;
                }
            }

            await Channels();
            user_type = false;
        } else {
            user_type = true;
        }

    }
    if (jsxTemplate[0] === undefined) {
        jsxTemplate[0] = null;
    }
    return {
        props: {csrfToken: req.csrfToken(), user: user_type, class_room: jsxTemplate[0]},
    }
}


function Home({csrfToken, user, class_room}) {
    if (class_room === null) {
        class_room = false;
    }
    const Channels = (params) => {
        const dict = params.arr;

        if (dict) {
            const dynamicCarts = [];
            for (let i in dict) {
                const plot = dict[i];
                dynamicCarts.push(
                    <div key={i}>
                        <Box className={styles.carts}>
                            <h1 className={styles.textCenterCart}>{plot.SubjectName}</h1>
                        </Box>
                    </div>
                )
            }
            return (
                <div>
                    <center><h2>Your notes channels</h2></center>
                    <div className={styles.cartFrame}>{dynamicCarts}</div>
                </div>
            );
        } else {
            return null;
        }
    }


    const subNav = {
        width: "100%", borderBottom: "1px solid gray", marginTop: "-15px"
    }

    const subNavIcons = {
        marginLeft: "5px", fontSize: "20px"
    }

    const TeacherMenu = (params) => {
        if (params.bool === false) {
            return (
                <div>
                    <div>
                        <Button
                            id="basic-button"
                            onClick={() => {
                                Router.push('/create_session');
                            }}
                        >
                            Create classroom <MdSchool style={subNavIcons}/>
                        </Button>
                        <Button onClick={() => {
                            Router.push("/manage_classroom")
                        }}>Manage Classroom <MdOutlineManageAccounts style={subNavIcons}/> </Button>
                    </div>
                    <br/>
                </div>
            )
        } else {
            return (
                <div>
                    <center>
                        <h2>Join notes channels </h2>

                        <TextField
                            label="join code"
                            id="outlined-start-adornment"
                            sx={{m: 1, width: '25ch'}}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><TbNotes /></InputAdornment>,
                            }}
                        />
                    </center>
                </div>
            );
        }
    }


    return (
        <div>
            <Nav/>
            <TeacherMenu bool={user}/> <br/>
            <Channels arr={class_room}/>
        </div>
    );
}

export default Home;