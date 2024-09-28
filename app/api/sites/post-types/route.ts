import { NextApiRequest, NextApiResponse } from 'next';
import { createPostType, getPostTypes } from '@/lib/actions/post-types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const postTypes = await getPostTypes(Number(req.query.siteId));
    res.status(200).json(postTypes);
  } else if (req.method === 'POST') {
    const postType = await createPostType(req.body);
    res.status(201).json(postType);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
