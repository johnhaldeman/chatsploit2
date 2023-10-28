import * as db from '../../lib/db';
import { getLoginSession } from '../../lib/auth'
import { findUser } from '../../lib/user'
var crypto = require('crypto');
var base32 = require('thirty-two');

export default async function handler(req, res) {
    try {
        const session = await getLoginSession(req)
        console.log("SETUP:" + JSON.stringify(session));
        const user = (session && (await findUser(session))) ?? null
        if (!session || !user) {
            res.status(401).end('Authentication token is invalid, please log in')
            return
        }
        var secret = base32.encode(crypto.randomBytes(16));
        secret = secret.toString().replace(/=/g, '');

        db.updateTOTPSecret(user.username, secret);

        res.status(200).json({ secret });
    } catch (error) {
        console.error(error)
        res.status(401).end('Authentication token is invalid, please log in')
        return
    }
}







