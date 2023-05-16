import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

sqlite3.verbose()

async function openDb () {
    return open({
      filename: 'chatsploit.db',
      driver: sqlite3.Database
    })
}

export async function initDB(){    
    if(db === undefined){
        db = await openDb();

        console.log("initializing")

        await db.exec(`CREATE TABLE IF NOT EXISTS CHATSPLOIT_USERS (
            id TEXT,
            created DATE,
            username TEXT,
            name TEXT,
            password TEXT
        )`)

        await db.exec(`CREATE TABLE IF NOT EXISTS CHATSPLOIT_MESSAGES (
            from_id TEXT,
            to_id TEST,
            sent DATE,
            message TEXT
        )`)
    }
    
}


let db = undefined;

export async function getConversationList(user, selectedFriend){
    await initDB();
    
    let sqlString = `
        SELECT DISTINCT CHATSPLOIT_USERS.id, username, name
        FROM CHATSPLOIT_USERS, (
                SELECT DISTINCT from_id as id
                    FROM CHATSPLOIT_MESSAGES
                    WHERE to_id = '${user}'
                UNION ALL 
                SELECT DISTINCT to_id as id
                FROM CHATSPLOIT_MESSAGES
                WHERE from_id = '${user}'
            ) CONVOS
        WHERE CHATSPLOIT_USERS.id = CONVOS.id
        OR CHATSPLOIT_USERS.id = '${selectedFriend}'
        ORDER BY username
    `;
    console.log("Executing: " + sqlString);

    let retRows = [];
    try {
            await db.each(
            sqlString,
            (err, row) => {
                if(err) {
                    throw err;
                }
                else{
                    console.log("pushing")
                    retRows.push(row);
                }
            }
        );
    }
    catch(err){
        throw err
    }
    return retRows;

}

export async function sendMessage(from, to, message){
    await initDB();
    await db.exec(
        `INSERT INTO CHATSPLOIT_MESSAGES(from_id, to_id, message, sent) 
        VALUES('${from}', '${to}', '${message}', '${Date.now()}')`
    );
}

export async function getMessages(user, friend){
    await initDB();
    
    let sqlString = `
        SELECT from_id, to_id, sent, message
        FROM CHATSPLOIT_MESSAGES
        WHERE ( from_id = '${user}' AND to_id = '${friend}')
        OR ( from_id = '${friend}' AND to_id = '${user}')
        ORDER BY sent
    `;
    console.log("Executing: " + sqlString);

    let retRows = [];
    try {
            await db.each(
            sqlString,
            (err, row) => {
                if(err) {
                    throw err;
                }
                else{
                    retRows.push(row);
                }
            }
        );
    }
    catch(err){
        throw err
    }
    return retRows;
}

export async function createUser(user){
    await initDB();
    await db.exec(
        `INSERT INTO CHATSPLOIT_USERS(id, created, username, name, password) 
        VALUES('${user.id}', '${user.created}', '${user.username}', '${user.name}', '${user.password}')`
    );
}

// export async function searchUsers(searchFor) {
//     await initDB();

//     let sqlString = `SELECT id, created, name, username FROM CHATSPLOIT_USERS WHERE username LIKE '%${searchFor}%'`;
//     console.log("Executing: " + sqlString);

//     let retRows = [];
//     try {
//             await db.each(
//             sqlString,
//             (err, row) => {
//                 if(err) {
//                     throw err;
//                 }
//                 else{
//                     retRows.push(
//                         {
//                             joined: new Date(row.created),
//                             ...row
//                         }
//                     );
//                 }
//             }
//         );
//     }
//     catch(err){
//         throw err
//     }
//     return retRows;
// }

export async function searchUsers(searchFor) {
    await initDB();

    let stmt = await db.prepare(
        "SELECT id, created, name, username FROM CHATSPLOIT_USERS WHERE username LIKE ?", 
        "%" + searchFor + "%"
    );

    let retRows = [];
    try {
            await stmt.each(
            (err, row) => {
                if(err) {
                    console.log("ERROR!", err)
                    throw err;
                }
                else{
                    retRows.push(
                        {
                            joined: new Date(row.created),
                            ...row
                        }
                    );
                }
            }
        );
    }
    catch(err){
        console.log("ERROR!", err)
        throw err
    }
    return retRows;
}


export async function getUser(username) {
    await initDB();
    return await db.get(
        `SELECT * FROM CHATSPLOIT_USERS WHERE USERNAME='${username}'`
    );
}




  
