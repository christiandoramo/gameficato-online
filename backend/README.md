seedando:

ENV_FILE=.customers.env npx sequelize-cli  seed:generate --name add-stores

rodando os seed
./seed.sh

criando nova migração

ENV_FILE=.customers.env npx sequelize-cli migration:generate --name add-fields-to-users

rodando as migration
./migrate.sh

### Para criar novo serviço:
```
npx nest g app <nome do service> - ex: products>
```
Lá no nest-cli.json vai ser criado automaticamente:
```
..."
"products": {
  "type": "application",
  "root": "apps/products",
  "entryFile": "main",
  "sourceRoot": "apps/<nome do serviço>/src",
  "compilerOptions": {
    "tsConfigPath": "apps/<nome do serviço>/tsconfig.app.json"
  }
},..."
```
- Agora falta fazer um .<serviço>.env como o de users e fazer um main como o de users
- Mas  ainda deve configurar o prisma + banco de cada serviço que o professor não mostrou exemplo ainda
- Apagar a pasta "test" já que o professor não pede



### Como rodar - (OBS: Colocar dentro do DOC abaixo na entrega final)
Para rodar TUDO no docker compose:
```
docker-compose --profile local up -d
```

rodando as migraçoes:
```
chmod +x migrate.sh
./migrate.sh db:migrate
```

Para rodar só o necessário com o docker-compose, e depois rodar os serviços node "manualmente" em multiplos terminais, basta subir somente o NATS e os bancos:
```
docker-compose --profile infra up -d
```
e depois rodar cada serviço (lembrar de colocar o serviço no docker compose como está em "users"):
```
docker compose up <nome de cada serviço>
```
OU pode rodar localmente atualizando a cada modificações de código como com "nodemon"
```
npx nest start <nome do serviço> --watch
```
