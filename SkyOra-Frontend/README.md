# SkyOraFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

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

To execute unit tests with the Angular test runner, use one of the following commands:

```bash
npm run test:unit
```

or

```bash
npm test
```

This runs the existing Angular unit test suite for services and components.

## Running user acceptance tests (UAT)

This project includes Playwright-based UAT/e2e tests. Install browser dependencies first:

```bash
npm install
npx playwright install
```

Then run the acceptance test suite:

```bash
npm run test:uat
```

The UAT tests automatically start the local Angular server and verify critical pages like the home page and login page.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
