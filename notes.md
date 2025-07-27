apagando containers, caches e volumes
docker stop $(docker ps -aq) &&
docker rm $(docker ps -aq) &&
docker-compose down -v &&
docker volume prune -f

para apagar imagens: docker rmi $(docker images -a -q)