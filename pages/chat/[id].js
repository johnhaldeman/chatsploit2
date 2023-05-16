
import { Chat } from "../../components/chat"
import { useRouter } from 'next/router'

export default function ChatPage() {
  const router = useRouter()
  const { id } = router.query

  return <Chat id={id} />
}
