

export const fetcher = (url) =>
fetch(url)
  .then((r) => r.json())
  .then((data) => {
    return { user: data?.user || null }
})



