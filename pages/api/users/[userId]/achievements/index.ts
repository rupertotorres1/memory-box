import { NextApiRequest, NextApiResponse } from "next";
import jwt from "next-auth/jwt";
import database from "../../../../../database";
import { Achievement } from "../../../../../types";

type PostBody = { text: string };

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await jwt.getToken({ req, secret: process.env.SECRET });
  if (!token) {
    res.status(401).json({});
  }

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
      const newAchievement: Achievement = {
        id: dbRes.insertedId.toString(),
        text,
      };

      res.status(200).json(newAchievement);
      break;
    }
  }
};
