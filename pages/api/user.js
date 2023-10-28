import { getLoginSession } from '../../lib/auth'
import { findUser } from '../../lib/user'

export default async function user(req, res) {
  try {
    const session = await getLoginSession(req)
    const user = (session && (await findUser(session))) ?? null

    if(user){
      res.status(200).json({ user: {...user, totp_success: session?.totp_success} })
    }
    else{
      res.status(200).json({user})
    }
  } catch (error) {
    console.error(error)
    res.status(500).end('Authentication token is invalid, please log in')
  }
}
