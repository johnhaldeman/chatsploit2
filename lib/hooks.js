import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import { fetcher } from './utils';

export function useUser({ redirectTo, redirectIfFound, noTotpRedirect } = {}) {
  const { data, error } = useSWR('/api/user', fetcher)
  const user = data?.user
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(() => {
    console.log({user})
    console.log("REDIRECT: ", data)
    if (!redirectTo || !finished) return
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo)
    }
    else if(user && !noTotpRedirect && !user.totp_success){
       Router.push("/totp-check")
    }
  }, [redirectTo, redirectIfFound, finished, hasUser])

  return error ? null : user
}
