import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import database from "../../../../../database";

type DeleteQuery = {
  achievementId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await database();

  switch (req.method) {
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
