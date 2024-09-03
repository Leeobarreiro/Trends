import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb+srv://Rivick:Xdplos2adr@cluster0.1gcqz.mongodb.net/mydatabase?retryWrites=true&w=majority';

export default async function handler(req: any, res: any) {
  console.log('Request received:', req.method);

  if (req.method === 'GET') {
    const client = new MongoClient(MONGO_URI);
    
    try {
      console.log('Connecting to MongoDB...');
      await client.connect();
      console.log('Connected to MongoDB');

      const db = client.db('mydatabase');
      const collection = db.collection('hashtags');

      const pipeline = [
        {
          $group: {
            _id: "$hashtag",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            hashtag: "$_id",
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ];

      console.log('Executing aggregation pipeline...');
      const trends = await collection.aggregate(pipeline).toArray();
      console.log('Aggregation result:', trends);

      res.status(200).json(trends);
    } catch (error) {
      console.error('Error while connecting to MongoDB or fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      console.log('Closing MongoDB connection');
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
