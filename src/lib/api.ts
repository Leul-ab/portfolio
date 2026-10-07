export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "same-origin",
  })

  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(result.error || "The request could not be completed.")
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}