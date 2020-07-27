import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Get data from your database
  switch (req.method) {
    case 'DELETE':
      res.status(200).json({});
      break;
  }
};
