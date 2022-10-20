import Nav from './nav.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "@mui/material/Button";
import csrf from "../utils/cerf";
import * as React from 'react';
import Router from 'next/router';
import RedirectDecorator from "../utils/login_required";
import HostRequired from "../utils/host_required";
import styles from "/styles/Session.module.css"

export async function getServerSideProps(context) {
    const {req, res} = context;
    await csrf(req, res);

    const host = await HostRequired(req);
    // if not host
    if (host === true) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    const auth = RedirectDecorator(req);

    if (auth) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    return {
        props: {csrfToken: req.csrfToken()},
    }
}

export default function CreateSession({csrfToken}) {
    const rowFormTrim = {
        width: "100%",
        float: "left",
        marginTop: "20px"
    }

    const formTrim = {
        width: "80%",
        float: "left"
    }

    const hostFromSubmit = () => {
        const request = new Request('/api/session_register_api', {
            headers: {'Content-Type': 'application/json', 'CSRF-Token': csrfToken}
        });
        fetch(request, {
            mode: 'same-origin',
            method: "post",
            body: JSON.stringify({
                'class_name': className.current.value,
                'class_code': classCode.current.value,
                'subject_code': subjectCode.current.value,
            })
        }).then(rsp => rsp.json()).then(function (response) {
            if (response.success === true) {
                Router.push('/');
            } else {
                if (response.message) {
                    alert(response.message);
                }
            }
        })
    }

    const className = React.useRef(null);
    const classCode = React.useRef(null);
    const subjectCode = React.useRef(null);

    return (
        <div>
            <Nav/> <br/>
            <center>
                <div className={styles.form_frame}>
                    <div style={{height: "350px"}} className="shadow p-3 mb-5 bg-white rounded">
                        <center>
                            <h5>CREATE CLASSROOM</h5>
                        </center>
                        <br/>
                        <div>
                            <div className={styles.form_spacing}>
                                <input ref={className} type="text" className="form-control"
                                       placeholder="Classroom Name"/>
                            </div>
                            <div className={styles.form_spacing}>
                                <input ref={classCode} type="text" className="form-control"
                                       placeholder="Classroom code or grade"/>
                            </div>

                            <div className={styles.form_spacing}>
                                <input ref={subjectCode} type="text" className="form-control"
                                       placeholder="Subject Name"/>
                            </div>
                            <Button className={styles.form_spacing} onClick={(ev) => {
                                hostFromSubmit(ev);
                            }} variant="contained">Host</Button>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    )
}