import { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../../database"; // TODO: this is so ugly

type Achievement = {
  id: string;
  text: string;
};

type PostBody = { text: string };

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await database();

  switch (req.method) {
    case "GET": {
      const dbRes = await db.collection("achievements").find().toArray();
      const achievements = dbRes.map(
        (item) => ({ id: item._id.toString(), text: item.text } as Achievement)
      );

      res.status(200).json({ achievements });
      break;
    }
    case "POST": {
      const { text } = req.body as PostBody;

      const dbRes = await db.collection("achievements").insertOne({ text });
      const newAchievement: Achievement = { id: dbRes.insertedId, text };

      res.status(200).json(newAchievement);
      break;
    }
  }
};
