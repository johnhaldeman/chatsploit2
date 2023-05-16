import * as db from '../../../../lib/db';

export default async function handler(req, res) {
    const { params } = req.query

    const user = params[0];
    const selectedFriend = params[1];

    let messages = [];
    try{
        messages = await db.getMessages(user, selectedFriend);
        res.status(200)
            .json({messages})
    }
    catch(error){
        res.status(500)
            .json({error})
    }
  }

