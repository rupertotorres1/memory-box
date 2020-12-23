import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import jwt from "next-auth/jwt";
import database from "../../../../../database";

type DeleteQuery = {
  achievementId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await jwt.getToken({ req, secret: process.env.SECRET });
  if (!token) {
    res.status(401).json({});
  }

  const db = await database();

  switch (req.method) {
    // TODO: only delete if they are the owner
    case "DELETE": {
      const { achievementId } = req.query as DeleteQuery;

      db.collection("achievements").deleteOne({
        _id: new ObjectId(achievementId),
      });

      res.status(200).json({});
      break;
    }
  }
};
