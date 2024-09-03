// api/trends.ts

export const config = {
    runtime: 'edge', 
  };
  
  export default async function handler(req: Request) {
    if (req.method === 'GET') {
      const data = await fetch('YOUR_MONGODB_URI', {
        method: 'POST',
        body: JSON.stringify({ query: 'YOUR_QUERY' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const json = await data.json();
      return new Response(JSON.stringify(json), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response('Method not allowed', { status: 405 });
    }
  }
  