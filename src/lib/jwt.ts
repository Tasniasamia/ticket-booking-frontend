// Go backend এর JwtClaims এর সাথে মেলানো: user_id, name, email, role, is_verified + exp/iat
export type JwtClaims = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  exp: number; // Unix seconds
  iat?: number;
};

/**
 * Token এর payload পড়ে। এটা signature যাচাই করে না, যাচাই করে Go backend (ValidateToken)।
 * তাই এখান থেকে পাওয়া role শুধু UI আর redirect এর জন্য, নিরাপত্তার সিদ্ধান্ত backend নেয়।
 */
export function decodeJwt(token: string): JwtClaims | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const bin = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))); // বাংলা নামের জন্য UTF-8
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export function isExpired(claims: Pick<JwtClaims, "exp">) {
  return claims.exp * 1000 <= Date.now();
}
