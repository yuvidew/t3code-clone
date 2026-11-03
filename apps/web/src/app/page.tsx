"use client";
import { useQuery } from "@tanstack/react-query";
import { healthSchema } from "@repo/shared";
import { Button } from "@repo/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function Home() {
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: async () => healthSchema.parse(await (await fetch(`${API_URL}/health`)).json()),
  });
  return (
    <main style={{ padding: 24 }}>
      <h1>Monorepo</h1>
      <pre>{error ? String(error) : JSON.stringify(data, null, 2)}</pre>
      <Button onClick={() => refetch()} disabled={isFetching}>Ping API</Button>
    </main>
  );
}
