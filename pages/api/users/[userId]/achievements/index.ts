import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../../backendUtils/database";
import withAuth from "../../../../../backendUtils/middleware/withAuth";
import { Achievement } from "../../../../../types";

type PostBody = { text: string };

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authToken: object
) => {
  const db = await database();

  switch (req.method) {
    case "GET": {
      const dbRes = await db
        .collection("achievements")
        .find({ userEmail: authToken["email"] })
        .toArray();
      const achievements = dbRes.map(
        (item) => ({ id: item._id.toString(), text: item.text } as Achievement)
      );

      res.status(200).json({ achievements });
      break;
    }

    case "POST": {
      const { text } = req.body as PostBody;

      const dbRes = await db
        .collection("achievements")
        .insertOne({ text, userEmail: authToken["email"] });
      const newAchievement: Achievement = {
        id: dbRes.insertedId.toString(),
        text,
      };

      res.status(200).json(newAchievement);
      break;
    }
  }
};

export default withAuth(handler);
