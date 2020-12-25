import { useSession as nextAuthUseSession, signIn } from "next-auth/client";

export default function useSession() {
  const [session, loading] = nextAuthUseSession();
  if (!loading && !session) {
    signIn();
    return [session, true];
  }
  return [session, loading];
}
