
import { JwtPayload } from 'jsonwebtoken';
export interface JwtUserPayload {
  // id: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtUserPayload;
    }
  }
}
// types/express/index.d.ts
declare namespace Express {
  export interface Request {
    user?: {
      username: string;
      role: string;
    };
  }
}
