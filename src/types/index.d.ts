
import { Request } from "express";

import { JwtPayload } from 'jsonwebtoken';
// utils/jwt.ts
export interface JwtUserPayload {
   userId: number;
  username: string;
  email: string;
  role: string; 
  photo?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

// types/express/index.d.ts
// declare namespace Express {
//   export interface Request {
//     user?: {
//       username: string;
//       role: string;
//     };
//   }
// }
