
Application based on [ThinkJS](http://www.thinkjs.org)

## Install dependencies

```
npm config set registry https://registry.npm.taobao.org --global
npm install
```

## Start server

```
npm run start
```

## Compile server

```
npm run compile
```

## Test with pm2

Use pm2 to deploy app on production enviroment.

```
pm2 startOrReload pm2_test.json
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```
pm2 startOrReload pm2_production.json
```