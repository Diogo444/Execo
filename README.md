# Execo

Execo est une petite application Angular + Angular Material qui affiche une interface composee de boutons. Chaque bouton peut declencher une action cote backend. Le backend recoit l'action demandee, retrouve la commande associee, puis l'execute sur une machine distante via SSH.

## Architecture

```text
Frontend Angular
  src/app/app.ts
  src/app/app.html
  src/app/app.scss
        |
        | POST http://localhost:3000/api/action
        | body: { actionName: action.id }
        v
Backend Express
  backend/app.js
        |
        | SSH
        v
Serveur distant
```

## Installation

Installer les dependances du frontend :

```bash
npm install
```

Installer les dependances du backend :

```bash
cd backend
pnpm install
```

Le backend utilise actuellement `express`, `dotenv`, `node-ssh`, `cors` et `body-parser`. Si `cors` ou `body-parser` ne sont pas installes dans votre environnement, les ajouter dans `backend/` :

```bash
pnpm add cors body-parser
```

## Lancer le projet

### Backend

Creer un fichier `.env` dans le dossier `backend/` :

```env
PORT_APP=3000
SSH_HOST=adresse_du_serveur
SSH_USERNAME=utilisateur_ssh
SSH_PASSWORD=mot_de_passe_ssh
```

Lancer le backend :

```bash
cd backend
node app.js
```

Le serveur doit afficher :

```text
Server is running on port 3000
```

### Frontend

Dans un deuxieme terminal, lancer Angular :

```bash
npm start
```

Ouvrir ensuite :

```text
http://localhost:4200
```

## Fonctionnement du frontend

Le frontend est une application Angular standalone.

Fichiers principaux :

```text
src/main.ts              Demarre l'application Angular
src/app/app.config.ts    Configure le router et HttpClient
src/app/app.ts           Contient la liste des boutons et la logique de clic
src/app/app.html         Affiche la grille de boutons
src/app/app.scss         Gere la disposition et les styles des boutons
src/styles.scss          Configure le theme Angular Material global
```

### Theme Angular Material

Le theme est configure dans `src/styles.scss`.

```scss
@include mat.theme(
  (
    color: (
      theme-type: dark,
      primary: mat.$rose-palette,
      tertiary: mat.$red-palette,
    ),
    typography: Roboto,
    density: 0,
  )
);
```

L'application utilise donc :

```text
theme-type: dark
primary: rose
tertiary: red
```

Les boutons utilisent les variables du theme Material, par exemple :

```scss
var(--mat-sys-primary)
var(--mat-sys-primary-container)
var(--mat-sys-tertiary-container)
var(--mat-sys-on-primary)
var(--mat-sys-on-surface)
```

### Grille de boutons

La grille est generee automatiquement dans `src/app/app.html` avec :

```html
@for (action of actionButtons; track action.label) { ... }
```

Chaque bouton vient du tableau `actionButtons` dans `src/app/app.ts`.

## Documentation des boutons

### Structure d'un bouton

Chaque bouton respecte ce format :

```ts
{
  label: 'Bouton 17',
  icon: 'favorite',
  variant: 'filled',
  size: 'standard',
  id: 'button-17',
}
```

### Champs disponibles

`label`
: Texte affiche dans le bouton.

```text
label: 'Mon bouton'
```

`icon`
: Nom de l'icone Material affichee dans le bouton.

```text
icon: 'star'
```

Les icones viennent de Material Icons. Exemples utiles :

```text
favorite
star
bolt
palette
layers
widgets
rocket_launch
verified
settings
extension
```

`variant`
: Style visuel du bouton.

Valeurs possibles :

```text
filled
raised
outlined
soft
```

`filled`
: Bouton plein avec la couleur principale du theme Angular Material.

`raised`
: Bouton sureleve base sur la couleur tertiaire du theme.

`outlined`
: Bouton contour avec fond sombre legerement teinte.

`soft`
: Bouton plus doux avec un fond discret et une bordure legere.

`size`
: Taille et disposition du bouton dans la grille.

Valeurs possibles :

```text
standard
wide
tall
compact
```

`standard`
: Taille normale.

`wide`
: Prend deux colonnes sur desktop.

`tall`
: Prend deux lignes sur desktop.

`compact`
: Bouton plus petit.

`id`
: Identifiant technique envoye au backend. Cet identifiant doit correspondre au `name` d'une action backend si le bouton doit declencher une commande.

```text
id: 'list'
```

### Ajouter un bouton cote frontend

Dans `src/app/app.ts`, ajouter un objet dans `actionButtons` :

```ts
protected readonly actionButtons: ActionButton[] = [
  { label: 'Bouton 01', icon: 'radio_button_checked', variant: 'filled', size: 'wide', id: 'list' },
  { label: 'Bouton 02', icon: 'favorite', variant: 'raised', size: 'standard', id: 'button-02' },

  // Nouveau bouton
  { label: 'Docker', icon: 'terminal', variant: 'outlined', size: 'standard', id: 'docker' },
];
```

Le bouton apparait automatiquement dans l'interface.

### Exemples de combinaisons

Bouton principal large :

```ts
{ label: 'Action principale', icon: 'bolt', variant: 'filled', size: 'wide', id: 'main-action' }
```

Bouton discret :

```ts
{ label: 'Option', icon: 'tune', variant: 'soft', size: 'standard', id: 'option' }
```

Bouton contour compact :

```ts
{ label: 'Reglage', icon: 'settings', variant: 'outlined', size: 'compact', id: 'settings' }
```

Bouton haut :

```ts
{ label: 'Important', icon: 'workspace_premium', variant: 'raised', size: 'tall', id: 'important' }
```

## Clic sur un bouton

Quand l'utilisateur clique sur un bouton, Angular appelle :

```ts
runLater(action);
```

La methode envoie une requete HTTP au backend :

```ts
this.http.post(`${this.api}/action`, { actionName: action.id });
```

L'URL de l'API est definie dans `src/app/app.ts` :

```ts
protected api: string = 'http://localhost:3000/api';
```

Donc un clic envoie par exemple :

```http
POST http://localhost:3000/api/action
```

Avec ce body JSON :

```json
{
  "actionName": "list"
}
```

## Fonctionnement du backend

Le backend est dans `backend/app.js`.

Il utilise :

```text
express       Serveur HTTP
cors          Autorise les appels du frontend Angular
body-parser   Lit le body JSON des requetes
dotenv        Charge les variables du fichier .env
node-ssh      Execute les commandes sur un serveur distant en SSH
```

### Configuration Express

Le serveur active :

```js
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
```

`bodyParser.json()` permet de lire :

```json
{
  "actionName": "list"
}
```

`cors()` permet au frontend `localhost:4200` d'appeler le backend `localhost:3000`.

`dotenv.config()` charge les variables du fichier `.env`.

### Variables d'environnement

Le backend attend ces variables :

```env
PORT_APP=3000
SSH_HOST=adresse_du_serveur
SSH_USERNAME=utilisateur_ssh
SSH_PASSWORD=mot_de_passe_ssh
```

`PORT_APP`
: Port du backend Express.

`SSH_HOST`
: Adresse IP ou nom de domaine du serveur distant.

`SSH_USERNAME`
: Nom d'utilisateur SSH.

`SSH_PASSWORD`
: Mot de passe SSH.

### Liste des actions backend

Les actions disponibles sont dans le tableau `action` de `backend/app.js`.

Exemple :

```js
const action = [
  {
    name: 'list',
    command: 'ls -lo',
    describe: 'liste tous les fichiers du repertoire courant',
  },
  {
    name: 'docker',
    command: 'docker ps',
    describe: 'liste tous les conteneurs Docker en cours d execution',
  },
];
```

Important : le `id` du bouton frontend doit correspondre au `name` de l'action backend.

Exemple :

```ts
// Frontend
{ label: 'Liste', icon: 'list', variant: 'filled', size: 'standard', id: 'list' }
```

```js
// Backend
{
  name: 'list',
  command: 'ls -lo',
  describe: 'liste tous les fichiers du repertoire courant',
}
```

### Endpoint API

Le backend expose un endpoint :

```http
POST /api/action
```

Body attendu :

```json
{
  "actionName": "list"
}
```

Reponse si l'action existe et que la commande est lancee :

```json
{
  "message": "Commande executee avec succes"
}
```

Reponse si l'action n'existe pas :

```json
{
  "error": "Action non trouvee"
}
```

Status HTTP :

```text
200  Commande executee
400  Action non trouvee
500  Erreur lors de l'execution de la commande
```

### Execution SSH

Le backend utilise `NodeSSH` :

```js
await ssh.connect({
  host: process.env.SSH_HOST,
  username: process.env.SSH_USERNAME,
  password: process.env.SSH_PASSWORD,
});

const result = await ssh.execCommand(commande);
```

La commande est executee sur le serveur distant. Le backend affiche ensuite dans la console :

```text
STDOUT: ...
STDERR: ...
```

Puis la connexion SSH est fermee avec :

```js
ssh.dispose();
```

### Ajouter une nouvelle action backend

Ajouter une entree dans le tableau `action` de `backend/app.js` :

```js
{
  name: 'restart-docker',
  command: 'docker restart mon-conteneur',
  describe: 'redemarre un conteneur Docker',
}
```

Puis ajouter un bouton frontend avec le meme `id` :

```ts
{
  label: 'Restart Docker',
  icon: 'restart_alt',
  variant: 'raised',
  size: 'wide',
  id: 'restart-docker',
}
```

## Flux complet pour ajouter un bouton qui execute une commande

1. Ajouter l'action dans `backend/app.js`.
2. Donner un `name` unique a cette action.
3. Ajouter un bouton dans `src/app/app.ts`.
4. Mettre le meme identifiant dans le champ `id` du bouton.
5. Lancer le backend avec `node app.js`.
6. Lancer le frontend avec `npm start`.
7. Cliquer sur le bouton.
8. Verifier la console backend pour voir `STDOUT` et `STDERR`.

## Commandes utiles

Frontend :

```bash
npm start
npm run build
npm test -- --watch=false
```

Backend :

```bash
cd backend
pnpm install
node app.js
```

Tester l'API avec `curl` :

```bash
curl -X POST http://localhost:3000/api/action \
  -H "Content-Type: application/json" \
  -d "{\"actionName\":\"list\"}"
```

## Tests

Les tests frontend utilisent Vitest via Angular.

Lancer les tests :

```bash
npm test -- --watch=false
```

Le test actuel verifie :

```text
L'application se cree correctement.
L'interface rend bien 16 boutons.
```

Il n'y a pas encore de tests backend.

## Build

Compiler le frontend :

```bash
npm run build
```

Le build est genere dans :

```text
dist/Execo
```

## Notes importantes

- Le frontend appelle actuellement `http://localhost:3000/api`.
- Le backend doit donc tourner sur le port `3000` pour fonctionner sans modification.
- Le backend execute des commandes SSH : ne jamais exposer cette API publiquement sans authentification.
- Les commandes autorisees doivent rester definies dans le tableau `action`. Eviter d'executer directement une commande envoyee par le frontend.
- Les identifiants frontend `id` et backend `name` sont le lien entre l'interface et les commandes.

## Ressources Angular

Pour plus d'informations sur Angular CLI :

```bash
ng generate --help
```

Documentation officielle :

```text
https://angular.dev/tools/cli
```
