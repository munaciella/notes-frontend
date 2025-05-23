export async function fetcher<T>(
    path: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    if (res.status === 204) {
      return undefined as T;
    }
    return (await res.json()) as Promise<T>;
  }
  