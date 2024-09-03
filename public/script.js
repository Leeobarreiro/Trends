document.getElementById('fetchTrending').addEventListener('click', () => {
    console.log('Botão "Atualizar Trending" clicado.'); // Log de depuração
    fetch('/api/trends') // Endpoint da função serverless
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos do servidor:', data); // Log de depuração
            displayTrendingTopics(data);
        })
        .catch(error => console.error('Erro ao buscar tendências:', error));
});

function displayTrendingTopics(data) {
    console.log('Exibindo Trending Topics:', data); // Log de depuração
    const trendingDiv = document.getElementById("trending");
    trendingDiv.innerHTML = "<h2>Trending Hashtags</h2>";

    data.forEach(({ hashtag, count }) => {
        const p = document.createElement("p");
        p.textContent = `${hashtag}: ${count} mentions`;
        trendingDiv.appendChild(p);
    });
}
