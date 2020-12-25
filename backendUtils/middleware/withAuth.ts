import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";

const withAuth = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    authToken: object
  ) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await jwt.getToken({ req, secret: process.env.SECRET });
    if (!token) {
      return res.status(401).json({});
    }
    return handler(req, res, token);
  };
};

export default withAuth;
