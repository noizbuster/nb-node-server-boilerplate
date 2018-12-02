# Introduction
* express
* chai, mocha for testing
* eslint
* mongoose
    * Use connection
* (TODO) JSDoc for documentation
    * (TODO) Custom Plugin for extending typedef
    * (TODO) Template
    * (TODO) Swagger Plugin for OpenAPI
* (TODO) OAuth User
* (TODO) winston for logging
* nb-config for managing configuration with docker data volume

# Prerequisites

### Launch mongodb
```
docker run \
    --name my-mongo \
    --net=host \
    -ti \
    -d mongo:4
```

# How to use

### Initiate
1. clone this repository
1. remove .git directory `rm .git -rf`
1. change project name
    1. edit name field in `package.json`
    1. change default configuration file name in root as `[YourProjectName].default.yaml`

### How to change server configuration
1. prepare prerequisites
1. clone this repo
1. `npm install`
1. `npm start`

### Change port
edit `server.port` field on `./config/[YourProjectName].default.yaml`
