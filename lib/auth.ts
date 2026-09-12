import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: number;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export function verifyToken(request: Request): TokenPayload | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) return null;
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}