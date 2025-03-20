# Projet de Scraping avec Puppeteer

Ce projet utilise **Puppeteer** pour effectuer des actions de scraping sur le site **Leboncoin**. Il permet de récupérer les annonces de skates électriques, envoyer des messages aux vendeurs et générer un fichier HTML avec les résultats.

les étapes suivantes du projet  :

il Ouvre un navigateur Chromium avec Puppeteer
-Gérer l’authentification avec les cookies : les cookies permet de ne pas avoir un bloque d'acces aussi 
-apres l'authentification faire un register ou login le projet reste lancer et attend la connexion apres il Navigue vers la page des annonces Leboncoin
-Extraire les données des 10 annonces les plus récentes du skate electrique 
-Envoyer un message aux vendeurs
-Générer un fichier HTML pour afficher les résultats

## Prérequis

- **Node.js** (version 12 ou supérieure) installé sur votre machine.
- **npm** (qui est installé avec Node.js).

## Installation

1. **Clonez le repository** :

   Si ce n'est pas déjà fait, commencez par cloner le projet sur votre machine locale :

   ```bash
   git clone
   cd 
## Lancement 
npm start
## cookies permet de ne pas recevoir la captcha et bolquer l'acces au site 