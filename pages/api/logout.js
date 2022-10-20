import cookie from 'cookie';

export default async function logout(req, res) {
    const header = req.cookies['token'];
    if (header !== null) {
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", null, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 0,
                sameSite: "strict",
                path: "/",
            })
        );
        res.status(200).json({})
    }

    return res.status(200);

}