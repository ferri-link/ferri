import { fetchUserIfNotCompleted } from "@/lib/handlers/page";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await fetchUserIfNotCompleted();

  return children;
}
