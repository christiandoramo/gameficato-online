apagando containers, caches e volumes
docker stop $(docker ps -aq) &&
docker rm $(docker ps -aq) &&
docker-compose down -v &&
docker volume prune -f

para apagar imagens: docker rmi $(docker images -a -q)

apaga tudo do docker que está parado docker system prune -f
remove todos os contêineres parados, redes não utilizadas, imagens pendentes (dangling images) e cache de build sem associação a contêineres.