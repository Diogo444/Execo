# Execo

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0.

## Documentation des boutons

L'interface est construite automatiquement a partir du tableau `actionButtons` dans `src/app/app.ts`.
Pour ajouter un bouton, il suffit d'ajouter un nouvel objet dans ce tableau.

### Structure d'un bouton

Chaque bouton doit respecter cette forme :

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
: Style visuel du bouton. Valeurs possibles :

```text
filled
raised
outlined
soft
```

`filled`
: Bouton plein avec la couleur principale du theme Angular Material.

`raised`
: Bouton avec effet sureleve, base sur la couleur tertiaire du theme.

`outlined`
: Bouton contour avec fond sombre legerement teinte.

`soft`
: Bouton plus doux, avec un fond discret et une bordure legere.

`size`
: Taille et disposition du bouton dans la grille. Valeurs possibles :

```text
standard
wide
tall
compact
```

`standard`
: Taille normale.

`wide`
: Bouton plus large, il prend deux colonnes sur desktop.

`tall`
: Bouton plus haut, il prend deux lignes sur desktop.

`compact`
: Bouton plus petit.

`id`
: Identifiant technique du bouton. Il sert a savoir quelle action executer quand l'utilisateur clique.

```text
id: 'button-17'
```

Dans `runLater(action)`, cet `id` est envoye a l'API :

```ts
this.http.post(`${this.api}/action`, { action: action.id });
```

### Ajouter un nouveau bouton

Dans `src/app/app.ts`, ajouter une ligne dans le tableau `actionButtons` :

```ts
protected readonly actionButtons: ActionButton[] = [
  { label: 'Bouton 01', icon: 'radio_button_checked', variant: 'filled', size: 'wide', id: 'button-01' },
  { label: 'Bouton 02', icon: 'favorite', variant: 'raised', size: 'standard', id: 'button-02' },

  // Nouveau bouton
  { label: 'Bouton 17', icon: 'settings', variant: 'outlined', size: 'compact', id: 'button-17' },
];
```

Le bouton apparaitra automatiquement dans l'interface.

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

### Modifier le style global

Les styles des boutons sont dans `src/app/app.scss`.

Les couleurs viennent du theme Angular Material defini dans `src/styles.scss` :

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

Pour changer le theme, modifier `primary`, `tertiary` ou `theme-type`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
