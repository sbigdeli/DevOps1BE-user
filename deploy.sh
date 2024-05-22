#!/bin/bash

# Kompliera chmod
# chmod +x deploy.sh

# Bygg Docker-image
docker build -t userservice .

# Kontrollera om container redan körs och stoppa den
if [ $(docker ps -q -f name=container_userservice) ]; then
    docker stop container_userservice
    docker rm container_userservice
fi

# Starta en ny container
docker run -d -p 4001:4001 --name container_userservice userservice