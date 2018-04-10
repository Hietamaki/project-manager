# Shokunin - project-manager

Personal project management software for coordinating tasks and tracking time.

> This softare is in early development.

The software consists of three parts.

## Client - named Vitakka

Vue.js based interface that holds most of the logic.

### Running
```
# npm install

For local testing
# npm run dev

For deploying to HTTP server, configure config.js and vitakka/config/index.js public path
# npm run build

The compiled build is saved to dist/
```

## Server

Node.js based RESTful backend is responsible for saving and providing data to frontends.

### Running
```
# npm install

You can use optional environment variables
# PORT=X DEBUG=X npm start
```

## WebExtension

Extension for browser saves open links to tasks and provides quick access to projects.







