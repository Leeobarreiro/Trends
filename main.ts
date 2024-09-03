export const config = {
	runtime: 'edge', // Utilizando o runtime edge para serverless
  };
  
  export default async function handler(req: Request) {
	if (req.method === 'GET') {
	  const MONGO_DATA_API_URL = Deno.env.get('MONGO_DATA_API_URL');
	  const MONGO_API_KEY = Deno.env.get('MONGO_API_KEY');
  
	  if (!MONGO_DATA_API_URL || !MONGO_API_KEY) {
		return new Response('Configuração da API MongoDB faltando', { status: 500 });
	  }
  
	  const body = {
		dataSource: 'Cluster0', // Nome do cluster no MongoDB Atlas
		database: 'sample_mflix', // Nome do banco de dados
		collection: 'comments', // Nome da coleção
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
		const response = await fetch(`${MONGO_DATA_API_URL}/action/aggregate`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'api-key': MONGO_API_KEY,
		  },
		  body: JSON.stringify(body),
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
  