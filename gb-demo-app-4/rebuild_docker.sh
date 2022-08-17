#!/usr/bin/env bash
docker stop my_node_app
docker rm my_node_app
docker rmi gb-demo-app
docker build -t gb-demo-app .
docker run -d -p 80:3001 --name my_node_app gb-demo-app
# docker run --rm -ti -p 80:3001 --name my_node_app gb-demo-app