// Importar a biblioteca do MongoDB
import { MongoClient } from 'mongodb';

// Configurar o URI de conexão do MongoDB
const MONGO_URI = 'mongodb+srv://Rivick:Xdplos2adr@cluster0.1gcqz.mongodb.net/mydatabase?retryWrites=true&w=majority';

// Função handler para a API
export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    // Conectar ao cliente MongoDB
    const client = new MongoClient(MONGO_URI);
    
    try {
      // Conectar ao MongoDB
      await client.connect();

      // Selecionar o banco de dados e a coleção
      const db = client.db('mydatabase');
      const collection = db.collection('hashtags');

      // Realizar uma consulta agregada para obter as hashtags mais populares
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
          $limit: 10, // Alterar conforme necessário
        },
      ];

      // Executar a consulta
      const trends = await collection.aggregate(pipeline).toArray();

      // Retornar os resultados como resposta JSON
      res.status(200).json(trends);
      
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB ou buscar dados:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      // Fechar a conexão com o cliente MongoDB
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
