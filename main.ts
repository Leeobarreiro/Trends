
const MONGO_URI = 'mongodb+srv://Rivick:Xdplos2adr@cluster0.mongodb.net/sample_mflix?retryWrites=true&w=majority';
const MONGO_DATA_API_URL = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-jlaekkp/endpoint/data/v1';
const MONGO_API_KEY = 'yJjLHkVWTUCMMhyGj1tWVJJrrpCig1azv4lguI7SMwnmLIH3XJvvXibWxS6ivwJs';

// Conectar ao MongoDB e buscar dados
export default async function handler(req: Request) {
  if (req.method === 'GET') {
    const body = {
      dataSource: 'Cluster0',
      database: 'sample_mflix',
      collection: 'comments',
      pipeline: [
        {
          $group: {
            _id: "$hashtag",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            hashtag: "$_id",
            count: 1
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]
    };

    try {
      const response = await fetch(MONGO_DATA_API_URL + '/action/aggregate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': MONGO_API_KEY,
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        return new Response(JSON.stringify(data.documents), {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.error('Erro na resposta da API MongoDB:', data);
        return new Response('Erro ao buscar dados', { status: 500 });
      }
    } catch (error) {
      console.error('Erro ao conectar à MongoDB Data API:', error);
      return new Response('Erro interno do servidor', { status: 500 });
    }
  } else {
    return new Response('Método não permitido', { status: 405 });
  }
}
