
import * as db from '../../../lib/db';


export default function handler(req, res) {
    console.log("body", req.body);
    const message = req.body;
    db.sendMessage(message.from_id, message.to_id, message.message);    
    res.status(200).json();
}

  