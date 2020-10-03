import { useSession, signIn } from "next-auth/client";

export default function useLoginRedirect() {
  const [session, loading] = useSession();
  if (!loading && !session) {
    signIn();
    return true;
  }
  return loading;
}
