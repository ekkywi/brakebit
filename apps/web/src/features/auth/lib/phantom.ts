type PhantomPublicKey = {
  toBase58?: () => string;
  toString: () => string;
};

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: PhantomPublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: PhantomPublicKey;
  }>;
  signMessage: (
    message: Uint8Array,
    display?: "utf8" | "hex",
  ) => Promise<{ signature: Uint8Array } | Uint8Array>;
};

function asProvider(value: unknown): PhantomProvider | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as PhantomProvider;
  if (typeof candidate.connect !== "function") return null;
  if (typeof candidate.signMessage !== "function") return null;
  return candidate;
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const anyWindow = window as Window & {
    phantom?: { solana?: unknown };
    solana?: unknown;
  };

  const phantom = asProvider(anyWindow.phantom?.solana);
  if (phantom?.isPhantom) return phantom;

  const injected = asProvider(anyWindow.solana);
  if (injected?.isPhantom) return injected;

  return null;
}

export function publicKeyToAddress(key: PhantomPublicKey): string {
  if (typeof key.toBase58 === "function") return key.toBase58();
  return key.toString();
}

export async function connectPhantom(): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider) {
    throw new Error("Phantom wallet not found. Install Phantom to sign in.");
  }
  const connected = await provider.connect();
  return publicKeyToAddress(connected.publicKey);
}

export async function signUtf8Message(message: string): Promise<Uint8Array> {
  const provider = getPhantomProvider();
  if (!provider) {
    throw new Error("Phantom wallet not found. Install Phantom to sign in.");
  }
  const encoded = new TextEncoder().encode(message);
  const result = await provider.signMessage(encoded, "utf8");
  if (result instanceof Uint8Array) return result;
  return result.signature;
}
