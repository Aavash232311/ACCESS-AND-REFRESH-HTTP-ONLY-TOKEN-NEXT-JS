import Nav from './nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '/styles/ManageClassroom.module.css';
import {Input} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";




export default function ManageSession() {

    return (
        <div>
            <Nav/> <br/>
            <center>
                <div className={styles.formFrame}>
                    <div style={{height: "600px"}} className="shadow p-3 mb-5 bg-white rounded">
                        <Box sx={{display: "flex"}} className={styles.localFormControl}>
                            <Input sx={{width: "60%"}} placeholder="username of student"/>
                            <Button className={styles.searchButton} variant="outlined">Search</Button>

                        </Box>
                    </div>
                </div>
            </center>
        </div>
    )
}