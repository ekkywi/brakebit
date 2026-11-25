import bs58 from "bs58";
import { requestSignInNonce, verifySignIn, type AuthUser } from "./api";
import { connectPhantom, signUtf8Message } from "./lib/phantom";

/** Connect Phantom, sign the server nonce message, and verify it on the API. */
export async function signInWithPhantom(): Promise<AuthUser> {
  const address = await connectPhantom();
  const { message } = await requestSignInNonce(address);
  const signature = await signUtf8Message(message);

  return verifySignIn({
    address,
    message,
    signature: bs58.encode(signature),
  });
}
