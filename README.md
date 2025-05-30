# 🌦️ Météoland
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

![Version](https://img.shields.io/github/package-json/v/BlanguerinJordan/Meteoland)
![Last Commit](https://img.shields.io/github/last-commit/BlanguerinJordan/Meteoland)
![Issues](https://img.shields.io/github/issues/BlanguerinJordan/Meteoland)
![Repo Size](https://img.shields.io/github/repo-size/BlanguerinJordan/Meteoland)

---

## Météoland est une application web responsive qui affiche les prévisions météo sur 48h et 5 jours via l'API OpenWeather.

## 🚀 Fonctionnalités

- Recherche de ville via API gouvernementale
- Affichage des prévisions météo (48h, 5j)
- Intégration SVG des icônes météo
- Responsive (mobile, tablette, desktop)
- Utilisation de PM2 pour le développement
- Gestion de version automatique (npm version)

## 🧱 Stack technique

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Node.js, Express
- **Base de données**: (À venir)
- **API externes**: [OpenWeather](https://openweathermap.org/), [API Geo](https://geo.api.gouv.fr/)

## 🛠️ Installation

```bash
git clone git@github.com:BlanguerinJordan/Meteoland.git
cd Meteoland
npm install
cp .env.example .env  # Modifier la clé API OpenWeather
npm run firstdev
```
# ⚠️ Déploiement de Météoland en Production

Pour faire fonctionner correctement **Météoland** en production, il est nécessaire d'utiliser un **reverse proxy** (comme **Apache** ou **Nginx**) afin de rediriger les requêtes vers l'application Express, notamment pour :
- **les requêtes API** (comme `/api/weather`, `/api/city`, etc.)
- **l'accès au site web** (exposé par Express sous un chemin tel que `/Meteoland/`)

---

## Exemple de configuration Apache (HTTP)

Fichier à modifier : `/etc/apache2/sites-available/000-default.conf`

```apache
# ===== REVERSE PROXY VERS EXPRESS =====

# Pour l'API (ex: /api/login → Express)
ProxyPass "/api/" "http://localhost:3000/api/"
ProxyPassReverse "/api/" "http://localhost:3000/api/"

# Pour l'app web (ex: /Meteoland/ → Express)
ProxyPass "/Meteoland/" "http://localhost:3000/Meteoland/"
ProxyPassReverse "/Meteoland/" "http://localhost:3000/Meteoland/"

# Précaution utile pour les headers
ProxyPreserveHost On
```

Activer les modules nécessaires :

```bash
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2
```

---

## Exemple de configuration Nginx (HTTP)

```nginx
server {
    listen 80;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /Meteoland/ {
        proxy_pass http://localhost:3000/Meteoland/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔐 Déploiement en HTTPS

### Avec Apache (HTTPS)

Activer les modules SSL :

```bash
sudo a2enmod ssl
sudo a2ensite default-ssl
```

Fichier à modifier : `/etc/apache2/sites-available/default-ssl.conf`

```apache
<IfModule mod_ssl.c>
  <VirtualHost *:443>
    ServerAdmin webmaster@localhost
    ServerName ton-domaine.fr

    ProxyPass "/api/" "http://localhost:3000/api/"
    ProxyPassReverse "/api/" "http://localhost:3000/api/"

    ProxyPass "/Meteoland/" "http://localhost:3000/Meteoland/"
    ProxyPassReverse "/Meteoland/" "http://localhost:3000/Meteoland/"

    ProxyPreserveHost On

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/ton-domaine.fr/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/ton-domaine.fr/privkey.pem

    SSLProtocol All -SSLv2 -SSLv3
    SSLCipherSuite HIGH:!aNULL:!MD5
  </VirtualHost>
</IfModule>
```

Redémarrer Apache :

```bash
sudo systemctl reload apache2
```

---

### Avec Nginx (HTTPS)

```nginx
server {
    listen 443 ssl;
    server_name ton-domaine.fr;

    ssl_certificate /etc/letsencrypt/live/ton-domaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ton-domaine.fr/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /Meteoland/ {
        proxy_pass http://localhost:3000/Meteoland/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name ton-domaine.fr;
    return 301 https://$host$request_uri;
}
```

---

### 📦 Obtenir un certificat SSL avec Certbot

#### Pour Apache :
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache
```

#### Pour Nginx :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```


## 📜 Scripts disponibles

```bash
npm run start         # Lance l'app une fois
npm run firstdev      # Lance avec PM2 + watch
npm run dev           # Relance l'app (si déjà PM2 lancé)
npm run logs          # Affiche les logs
npm run version:patch # Version patch + git push + tag
npm run version:minor # Version mineure + git push + tag
npm run version:major # Version majeure + git push + tag
```
## 🚀 Améliorations futures

Voici quelques pistes d’évolution envisagées pour améliorer l’application Météoland :

- 🔍 **Recherhce 2.0** : 
  - Optimisation de la recherche pour les données météorologiques via OpenWeather.
  - Ajout d’une fonctionnalité d’autocomplétion en s’appuyant sur l’API gouvernementale.

- 💾 **Ajout d’une base de données** :
  - Pour stocker les utilisateurs, leurs préférences, et les villes favorites.

- 👤 **Ajout des pages `login` et `user`** :
  - Interface d’authentification et de gestion du profil utilisateur.

- ⭐ **Gestion des utilisateurs et des villes favorites** :
  - Possibilité pour un utilisateur connecté de sauvegarder ses villes préférées.

## 👤 Auteur

Jordan B. – [@BlanguerinJordan](https://github.com/BlanguerinJordan) - développeur web en formation, passionné de JS, design, et jeux vidéo 🎮

## 📝 Licence

Ce projet est sous licence ISC.
