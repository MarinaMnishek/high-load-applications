docker stop gb-demo-redis-instance
docker rm gb-demo-redis-instance
docker rmi gb-demo-redis
docker build -t gb-demo-redis . -f Dockerfile.redis
docker run --name gb-demo-redis-instance -p 6379:6379 -v redis-data:/data -d gb-demo-redis

