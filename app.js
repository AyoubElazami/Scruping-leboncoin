const puppeteer = require('puppeteer');
const fs = require('fs');
const generateHtml = require('./generateHtml');

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  if (fs.existsSync('cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    await page.setCookie(...cookies);
  }

  console.log('Veuillez vous connecter à Leboncoin...');
  await page.goto('https://auth.leboncoin.fr/login', { waitUntil: 'networkidle2' });

  let isConnected = false;
  for (let i = 0; i < 40; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (page.url().includes("login_status=OK")) {
      console.log('Connexion détectée via URL !');
      isConnected = true;
      break;
    }

    try {
      await page.waitForSelector('[data-qa-id="profil-link"]', { visible: true, timeout: 1000 });
      console.log('Connexion détectée via le profil utilisateur !');
      isConnected = true;
      break;
    } catch (error) {
      console.log('En attente de la connexion...');
    }
  }

  if (!isConnected) {
    console.log('Connexion non détectée après 80 secondes. Arrêt du script.');
    return;
  }

  console.log('Redirection vers la page des annonces...');
  await page.goto('https://www.leboncoin.fr/recherche?text=skate+électrique', { waitUntil: 'networkidle2' });

  try {
    await page.waitForSelector('article[data-test-id="ad"]', { visible: true, timeout: 10000 });
    console.log('Page des annonces chargée !');
  } catch (error) {
    console.log("Impossible de charger les annonces.");
    return;
  }

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article[data-test-id="ad"]'))
      .slice(0, 10)
      .map(item => {
        const titleElement = item.querySelector('a span');
        const linkElement = item.querySelector('a');
        const priceElement = item.querySelector('p[data-test-id="price"]');
        const imageElement = item.querySelector('picture img');

        return {
          title: titleElement ? titleElement.textContent.trim() : 'N/A',
          link: linkElement ? 'https://www.leboncoin.fr' + linkElement.getAttribute('href') : 'N/A',
          price: priceElement ? priceElement.textContent.trim() : 'N/A',
          image: imageElement ? imageElement.src : 'N/A'
        };
      });
  });

  console.log(results);

  let messagesSent = [];

  for (const ad of results) {
    if (ad.link !== 'N/A') {
      try {
        await page.goto(ad.link, { waitUntil: 'networkidle2' });

        await page.waitForSelector('button[data-test-id="contact-button"]', { visible: true });
        await page.click('button[data-test-id="contact-button"]');
        await new Promise(resolve => setTimeout(resolve, 2000));

        await page.waitForSelector('textarea#body', { visible: true });
        await page.type('textarea#body', "Bonjour, ce produit est-il toujours disponible ?");

        await page.waitForSelector('button[data-test-id="send-message"]', { visible: true });
        await page.click('button[data-test-id="send-message"]');

        console.log(`Message envoyé pour l'annonce: ${ad.title}`);
        messagesSent.push({ title: ad.title, status: "Envoyé", link: ad.link });

        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.log(`Impossible d'envoyer un message pour: ${ad.title}`);
        messagesSent.push({ title: ad.title, status: "Échec", link: ad.link });
      }
    }
  }

  generateHtml(results, messagesSent);

  console.log('Résultats enregistrés dans resultats.html');

  await browser.close();
}

main().catch(err => console.error(err));
