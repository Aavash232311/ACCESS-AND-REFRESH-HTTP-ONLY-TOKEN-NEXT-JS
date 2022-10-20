import {NextResponse} from "next/server";

export default function middleware(req) {
    let link = req.url;

    const JsonWebToken = req.cookies.get("token");

    // excluding email verification page
    if ((JsonWebToken === undefined && !link.includes("/login")) ||
        (!link.includes("/register") && JsonWebToken === undefined)) {
        if (req.method === "HEAD") {
            // Fixes the problem with redirects by forcing a native page load
            return NextResponse.error();
        }

        // console.log(req.method);

        // return NextResponse.redirect("http://localhost:3000/login/");

    }

}