import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import database from "../../../backendUtils/database";
import withAuth from "../../../backendUtils/middleware/withAuth";

type DeleteQuery = {
  achievementId: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authToken: object
) => {
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

export default withAuth(handler);
