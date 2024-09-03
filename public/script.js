document.getElementById('fetchTrending').addEventListener('click', () => {
    fetch('/api/trends') // Altere para o endpoint da função serverless
        .then(response => response.json())
        .then(data => displayTrendingTopics(data))
        .catch(error => console.error('Erro ao buscar tendências:', error));
});

function displayTrendingTopics(data) {
    const trendingDiv = document.getElementById("trending");
    trendingDiv.innerHTML = "<h2>Trending Hashtags</h2>";

    data.forEach(({ hashtag, count }) => {
        const p = document.createElement("p");
        p.textContent = `${hashtag}: ${count} mentions`;
        trendingDiv.appendChild(p);
    });
}
