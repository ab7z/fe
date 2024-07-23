#!/bin/bash

echo "$TOKEN" | docker login ghcr.io -u "$USERNAME" --password-stdin
SCRIPT_PATH="$(dirname "$0")"

Cleanup () {
  docker logout ghcr.io
  docker volume prune --all --force || true
  docker system prune --force --all --volumes || true
}

echo "--------------------------------------------"
echo "Start fe service"
echo "--------------------------------------------"

docker service rm fe-"$REF_NAME" || true
sleep 10

if ! docker service create \
  --name fe-"$REF_NAME" \
  --replicas 3 \
  --network infra \
  --with-registry-auth \
  ghcr.io/"$USERNAME"/"$IMAGE":"$REF_NAME"; then
  echo "fe service error"
  Cleanup
  exit 1;
fi

echo "--------------------------------------------"
echo "Start nginx proxy"
echo "--------------------------------------------"

docker service rm proxy || true
sleep 10

if ! docker service create \
  --name proxy \
  --replicas 3 \
  --network infra \
  --publish 80:80 \
  --mount type=bind,readonly=true,source="$SCRIPT_PATH"/nginx.conf,target=/etc/nginx/nginx.conf \
  nginx:stable; then
  echo "proxy service error"
  Cleanup
  exit 1;
fi
