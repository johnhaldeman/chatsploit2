import * as db from '../../../../lib/db';
import { getLoginSession } from '../../../../lib/auth'
import { findUser } from '../../../../lib/user'

export default async function handler(req, res) {
    const { params } = req.query

    const user = params[0];
    const selectedFriend = params[1];

    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
        console.log("CHECKING USERS")
        const session = await getLoginSession(req)
        const reqUser = (session && (await findUser(session))) ?? null
        if( !session || !reqUser ){
            res.status(401).end('Authentication token is invalid, please log in')
            return
        }
        else{
            if( user !== reqUser.id ){
                res.status(403).end('The logged in user is unauthorized to perform request')
                return
            }
        }
    } catch (error) {
        console.error(error)
        res.status(401).end('Authentication token is invalid, please log in')
        return
    }

    let conversations = [];
    try{
        conversations = await db.getConversationList(user, selectedFriend);     
        console.log("convos", conversations);  
        console.log("BEFORE HEADER")
        console.log("AFTER HEADER")
        res.status(200)
            .json({conversations})
    }
    catch(error){
        console.log(error);
        res.status(500)
            .json({error})
    }
  }

