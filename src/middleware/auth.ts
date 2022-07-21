import express, { Request, Response, NextFunction } from 'express';
import jwt, { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json("Access denied");

  const payload = jwt.verify(token, process.env.TOKEN_KEY || "TOKENkey");
  if (payload) {
    next();
  }

}

export const isAdmin = (req: Request, res: Response) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json("Insert Token");

  const payload = jwt.verify(token, process.env.TOKEN_KEY || "TOKENkey");
  const payloadAdm = jwt.verify(process.env.ADMIN_TOKEN, process.env.TOKEN_KEY || "TOKENkey");
  

  if (`${payload["user_id"]}` === payloadAdm["user_id"]) {
    return true;
  }
  return false


}


export const hasAuthorization = (req: Request, res: Response, user_id: string, id: string) => {
  const token = req.header('auth-token');
      const payload = jwt.verify(token, process.env.TOKEN_KEY || "TOKENkey");
      if (payload["user_id"] == user_id || payload["user_id"] == (process.env.ADMIN_ID)) {
        return true
      }
  return false
 
}