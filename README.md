# Cdf Clécy — Calculette de vente

Application web statique (HTML + JavaScript pur, sans framework) pour calculer
le total d'une vente à la buvette du Comité des Fêtes de Clécy.
Elle s'installe sur l'écran d'accueil d'un mobile (iOS / Android) et fonctionne
hors-ligne.

🔗 En ligne : <https://jmini.github.io/cfc/>

## Fichiers du projet

| Fichier | Rôle |
|---|---|
| `index.html` | L'application (interface, ticket de caisse, QR d'installation). |
| [`config.json`](config.json) | **Toute la configuration** : titre de version et liste des articles. |
| `editeur.html` | Éditeur visuel qui génère le contenu de `config.json`. |
| [`sw.js`](sw.js) | Service worker (mises à jour automatiques + hors-ligne). |
| `manifest.json` | Manifeste PWA (nom, icône, mode plein écran). |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Icônes d'application. |

---

## Configuration ([`config.json`](config.json))

C'est le **seul fichier à modifier** pour ajuster les tarifs ou les articles.
`index.html` le charge automatiquement au démarrage.

### Format

[`config.json`](config.json) est un fichier **JSON strict** :

- pas de commentaire à l'intérieur (d'où ce README) ;
- pas de virgule après le dernier élément d'une liste ou d'un objet ;
- les textes et couleurs sont entre guillemets doubles `"..."`.

Structure générale :

```json
{
  "version": "2026 Fête de la musique",
  "articles": [
    { "…": "article 1" },
    { "…": "article 2" }
  ]
}
```

### Champ `version`

Titre libre de la configuration, affiché dans le pied de page juste au-dessus
du lien d'installation. Exemple : `"2026 Fête de la musique"`.

### Champs d'un article

| Champ | Obligatoire | Description |
|---|:---:|---|
| `colonne` | ✅ | Colonne d'affichage : `1` = BOISSONS colone de gauche, `2` = BOISSONS colone de droite, `3` = RESTAURATION. |
| `libelle` | ✅ | Texte affiché sur la pastille (ex. `"BIÈRE"`). |
| `prix` | ✅ | Prix unitaire en euros. **Point décimal** (JSON), pas la virgule : `3.00`. |
| `limite` | ✅ | Quantité maximale vendable (stock max) ; le bouton `+` s'arrête à cette valeur. |
| `couleurFond` | ✅ | Couleur de fond de la pastille, en hexadécimal (ex. `"#f5e000"`). |
| `couleurTexte` | ✅ | Couleur du texte (ex. `"#000"` ou `"#ffffff"`). Un contour noir est ajouté automatiquement aux textes clairs. |
| `forme` | ✅ | `"cercle"` (boisson) ou `"rectangle"` (restauration). |
| `motif` | ⬜️ | `"hachures"` → hachures blanches à 45° sur le fond. |
| `inactif` | ⬜️ | `true` pour masquer l'article (ni affiché, ni vendable). |

Les champs facultatifs (`motif`, `inactif`) s'omettent simplement quand ils ne servent pas.

### Exemple d'article

```json
{ "colonne": 1, "libelle": "CIDRE", "prix": 3.50, "limite": 30,
  "couleurFond": "#f08a24", "couleurTexte": "#000",
  "forme": "cercle", "motif": "hachures" }
```

### Modifier la configuration

Deux méthodes :

1. **À la main** : éditer [`config.json`](config.json) en respectant le format JSON.
2. **Avec l'[éditeur](https://jmini.github.io/cfc/editeur.html)** : ouvrir la page, régler les articles et le titre de version, le contenu JSON se met à jour dans le cadre inférieur. Cliquer sur  **Copier**, et remplacer tout le contenu de [`config.json`](config.json) par le résultat.

> ⚠️ Après édition, vérifiez que le JSON reste valide : un oubli de virgule ou de
> guillemet empêche toute la page de se charger.

---

## Bon à savoir

- **Mise à jour du cache** : après un changement de contenu, incrémentez la ligne
  `const VERSION = "vX";` dans [`sw.js`](sw.js) pour que l'ancienne version en cache soit
  remplacée proprement.
- **Installation sur mobile** : ouvrir l'URL, puis « Ajouter à l'écran d'accueil »
  (Safari sur iOS, menu ⋮ sur Android). Le QR code est aussi accessible depuis le
  lien en bas de l'application.
- **Serveur local** : il est possible d'utiliser `python3 -m http.server 8888`
