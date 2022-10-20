import csrf from "../../utils/cerf";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default async function renewToken(req, res) {
    await csrf(req, res);
    if (req.method === "POST") {
        let jwt = require('jsonwebtoken');
        const header = req.cookies['token'];
        const refreshToken = req.cookies['longTermHash']
        if (header === null || refreshToken === null) {
            return res.status(403)
        }
        const decodedAccessToken = jwt.verify(header, process.env.JWT_SECRET_KEY, function (err, decoded) {
            if (err) return null;
            return decoded;
        });

        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET, function (err, decoded) {
            if (err) return null;
            return decoded;
        });
        if (decodedRefreshToken === null || decodedAccessToken === null) {
            return res.status(403)
        }
        const accessEmail = decodedAccessToken['tokenArgs']['email'];

        const refreshEmail = decodedRefreshToken['email'];
        let verify = false;
        if (accessEmail === refreshEmail) {
            verify = true;
        }
        if (!verify) {
            return res.status(403)
        }
        if (verify) {
            // hash new access token
            const accessTokenArgs = decodedAccessToken['tokenArgs'];
            const tokenArgs = {
                email: accessTokenArgs['email'],
                name: accessTokenArgs['full_name'],
                class_name: accessTokenArgs['class_name'],
                success: true,
                student: accessTokenArgs['student'],
                id: accessTokenArgs['id'],
            }
            let jwt = require('jsonwebtoken');

            jwt.sign({tokenArgs}, process.env.JWT_SECRET_KEY, function (err, token) {
                res.setHeader(
                    "Set-Cookie",
                    [
                        cookie.serialize("token", token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV !== "development",
                                maxAge: 600,
                                sameSite: "strict",
                                path: "/",
                            },
                        ),
                    ],
                );
                return res.status(200).json({
                    message: "valid", success: true
                });
            }, {expiresIn: '12m'});

        }
        return res.status(403);
    }
}