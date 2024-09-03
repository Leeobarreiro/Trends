// Importar a biblioteca do MongoDB
import { MongoClient } from 'mongodb';

// Definir a configuração da função
export const config = {
  runtime: 'edge',
};

// Configurar o URI de conexão do MongoDB
const MONGO_URI = 'mongodb+srv://Rivick:Xdplos2adr@cluster0.1gcqz.mongodb.net/mydatabase?retryWrites=true&w=majority';

// Conectar ao MongoDB e buscar dados
export default async function handler(req: Request) {
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
      return new Response(JSON.stringify(trends), {
        headers: { 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB ou buscar dados:', error);
      return new Response('Erro interno do servidor', { status: 500 });
    } finally {
      // Fechar a conexão com o cliente MongoDB
      await client.close();
    }
  } else {
    return new Response('Método não permitido', { status: 405 });
  }
}
