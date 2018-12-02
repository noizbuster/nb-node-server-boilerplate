#! /bin/bash

docker run \
    --name mymongo \
    --net=host \
    -ti \
    -d mongo:4
