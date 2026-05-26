import { useState, useEffect } from 'react'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(url: string): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch')
        const json = await response.json()
        if (isMounted) {
          setState({ data: json, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error: error as Error })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [url])

  return state
}
