import * as db from '../../../../lib/db';
import { getLoginSession } from '../../../../lib/auth'
import { findUser } from '../../../../lib/user'

export default async function handler(req, res) {
    try {
        console.log("CHECKING USERS")
        const session = await getLoginSession(req)
        const user = (session && (await findUser(session))) ?? null
        if( !session || !user ){
            res.status(401).end('Authentication token is invalid, please log in')
            return
        }
    } catch (error) {
        console.error(error)
        res.status(401).end('Authentication token is invalid, please log in')
        return
    }

    const { search } = req.query

    let users = [];
    try{
        users = await db.searchUsers(search);        
        res.status(200)
            .json({users})
    }
    catch(error){
        res.status(500)
            .json({error})
    }
  }

  