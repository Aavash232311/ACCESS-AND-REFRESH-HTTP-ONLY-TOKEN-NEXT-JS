import '../styles/globals.css';
import * as React from 'react';
import csrf from "../utils/cerf";

export async function getServerSideProps(context) {
    const {req, res} = context
    await csrf(req, res)
    return {
        props: {csrfToken: req.csrfToken()},
    }
}

function MyApp({Component, pageProps, csrfToken}) {

    return (
        <div style={{color: "black"}}>
            <Component {...pageProps} />
        </div>
    )
}

export default MyApp;

