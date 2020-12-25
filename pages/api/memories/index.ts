import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../backendUtils/database";
import withAuth from "../../../backendUtils/middleware/withAuth";
import { Memory } from "../../../types";

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
        .collection("memories")
        .find({ userEmail: authToken["email"] })
        .toArray();
      const memories = dbRes.map(
        (item) => ({ id: item._id.toString(), text: item.text } as Memory)
      );

      res.status(200).json({ memories });
      break;
    }

    case "POST": {
      const { text } = req.body as PostBody;

      const dbRes = await db
        .collection("memories")
        .insertOne({ text, userEmail: authToken["email"] });
      const newMemory: Memory = {
        id: dbRes.insertedId.toString(),
        text,
      };

      res.status(200).json(newMemory);
      break;
    }
  }
};

export default withAuth(handler);
