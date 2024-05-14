import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Welcome to admin {session?.user.username}</h1>
    </div>
  );
}
