const fs = require('fs');

function generateHtml(results, messagesSent) {
  let htmlContent = `
    <html>
    <head>
      <title>Résultats Leboncoin</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
        body { padding: 20px; }
        .card { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="mb-4">Top 10 Skates Électriques sur Leboncoin</h1>
        <div class="row">
          ${results.map(ad => `
            <div class="col-md-4">
              <div class="card">
                <img src="${ad.image}" class="card-img-top" alt="${ad.title}">
                <div class="card-body">
                  <h5 class="card-title">${ad.title}</h5>
                  <p class="card-text">Prix : ${ad.price}</p>
                  <a href="${ad.link}" target="_blank" class="btn btn-primary">Voir l'annonce</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <h2 class="mt-5">Messages envoyés</h2>
        <table class="table table-bordered mt-3">
          <thead class="table-dark">
            <tr>
              <th>Annonce</th>
              <th>Statut</th>
              <th>Voir</th>
            </tr>
          </thead>
          <tbody>
            ${messagesSent.map(msg => `
              <tr>
                <td>${msg.title}</td>
                <td>${msg.status === "Envoyé" ? "Envoyé" : "Échec"}</td>
                <td><a href="${msg.link}" target="_blank" class="btn btn-sm btn-info">Lien</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

  fs.writeFileSync('resultats.html', htmlContent, 'utf8');
}

module.exports = generateHtml;
