import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import database from "../../../backendUtils/database";
import withAuth from "../../../backendUtils/middleware/withAuth";

type DeleteQuery = {
  memoryId: string;
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
      const { memoryId } = req.query as DeleteQuery;

      db.collection("memories").deleteOne({
        _id: new ObjectId(memoryId),
      });

      res.status(200).json({});
      break;
    }
  }
};

export default withAuth(handler);
