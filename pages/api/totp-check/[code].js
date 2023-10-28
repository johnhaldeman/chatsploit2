import * as db from '../../../lib/db';
import { getLoginSession } from '../../../lib/auth'
import { findUser } from '../../../lib/user'
import { authenticator  } from 'otplib';

import { setLoginSession } from '../../../lib/auth'

export default async function handler(req, res) {
    try {
        const session = await getLoginSession(req)
        console.log("SETUP:" + JSON.stringify(session));
        const user = (session && (await findUser(session))) ?? null
        if (!session || !user) {
            res.status(401).end('Authentication token is invalid, please log in')
            return
        }
        const { code } = req.query
        console.log({code, secret: user.TOTP_SECRET})
        const totpvalid = authenticator.check(code, user.TOTP_SECRET);
        if(totpvalid){
            session.totp_success = true;
            db.setTOTPRegistered(user.username, true);
            await setLoginSession(res, session)
            res.status(200).json({ code: "good" });
        }
        else{
            res.status(400).end('TOTP code invalid. Please try again')
            return
        }

    } catch (error) {
        console.error(error)
        res.status(401).end('Authentication token is invalid, please log in')
        return
    }
}