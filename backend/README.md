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
npx nest g app <nome do service - ex: products>
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
--- 

# 🛒 Mercato Online - Marketplace Regional

Projeto desenvolvido como parte da disciplina **Desenvolvimento de Aplicações para Web** do curso de **Bacharelado em Ciência da Computação** da **Universidade Federal Rural de Pernambuco (UFRPE)**.

## 📌 Índice

- [📖 Introdução](#📖-introdução)
- [🎯 Escopo do Projeto](#🎯-escopo-do-projeto)
- [👥 Público Alvo](#👥-público-alvo)
- [❓ Problema e Justificativa](#❓-problema-e-justificativa)
- [🧠 Escolha do Tema](#🧠-escolha-do-tema)
- [📱 Wireframes](#📱-wireframes)
- [💰 Modelo de Remuneração](#💰-modelo-de-remuneração)
- [🚀 Funcionalidades](#🚀-funcionalidades)
- [🧩 Tecnologias Utilizadas](#🧩-tecnologias-utilizadas)
- [📂 Repositório e Gerência](#📂-repositório-e-gerência)
- [👨‍💻 Equipe de Desenvolvimento](#👨‍💻-equipe-de-desenvolvimento)
- [📆 Entrega do Projeto](#📆-entrega-do-projeto)

---

## 📖 Introdução

O **Mercato Online** é uma plataforma de **marketplace digital** que visa conectar **empresas e consumidores locais**, oferecendo uma alternativa regional e moderna aos grandes centros de e-commerce. O projeto tem como missão **digitalizar o comércio regional**, **fortalecer a economia local** e **facilitar a jornada de compra e venda online**.

---

## 🎯 Escopo do Projeto

- Sistema de autenticação para pessoas físicas e empresas
- Interface de marketplace para cadastro e visualização de produtos
- Integração com chatbot inteligente para suporte e automação
- Gamificação com premiações para consumidores engajados
- Módulos de entrega e pagamento automatizados

---

## 👥 Público Alvo

- **Empresas de venda de produtos**
- **Pessoas físicas com consumidores**

---

## ❓ Problema e Justificativa

O Mercato Online busca resolver os seguintes problemas:

1. **Baixa visibilidade** de fornecedores locais
2. **Dificuldade de conexão** entre compradores e vendedores regionais
3. **Processos manuais ou obsoletos** no comércio local
4. **Altos custos e prazos logísticos**
5. **Falta de confiança** em empresas desconhecidas
6. **Desinformação** sobre oportunidades do mercado regional
7. **Centralização** do comércio eletrônico no Sudeste

🔍 **Objetivo:** Criar um ecossistema de comércio regional sustentável e confiável.

---

## 🧠 Escolha do Tema

O tema foi escolhido por meio de **votação interna** entre os membros do grupo após a proposição de diversas ideias. O projeto foi selecionado por seu **potencial de impacto social** e **desafio técnico interessante**.

---

## 📱 Wireframes

Os principais wireframes da aplicação foram prototipados no **Figma**, incluindo telas de:

- Página principal do marketplace
- Visualização de produto
- Cadastro de loja
- Chatbot de suporte
- Tela de gamificação

*(Link ou screenshots podem ser adicionados futuramente)*

---

## 💰 Modelo de Remuneração

A monetização da plataforma será baseada em:

- **Taxa sobre vendas**
- **Impulsionamento pago** de lojas e produtos
- **Espaços para publicidade** no marketplace

---

## 🚀 Funcionalidades

| Funcionalidade                              | Status Esperado |
|--------------------------------------------|------------------|
| Registro de lojas e produtos               | ✅ Previsto      |
| Compra de produtos                         | ✅ Previsto      |
| Módulo de entrega com API dos Correios     | ✅ Previsto      |
| Módulo de pagamento com API MercadoPago    | ✅ Previsto      |
| ChatBot com IA (Botpress)                  | ✅ Previsto      |
| Gamificação com premiação                  | ✅ Previsto      |

---

## 🧩 Tecnologias Utilizadas

| Tecnologia       | Descrição                                      |
|------------------|------------------------------------------------|
| **JavaScript**   | Linguagem principal                            |
| **TypeScript**   | Tipagem estática para JS                       |
| **Node.js**      | Ambiente de execução backend                   |
| **NestJS**       | Framework backend baseado em Node.js           |
| **React**        | Biblioteca frontend para construção de UI      |
| **PostgreSQL**   | Banco de dados relacional                      |
| **TypeORM**      | ORM para PostgreSQL                            |
| **Google Cloud** | Armazenamento de arquivos                      |
| **Botpress**     | Plataforma para chatbot com IA                 |
| **Phaser.js**    | Biblioteca de jogos 2D (gamificação)           |
| **Redis**        | Banco de dados em cache                        |

---

## 👨‍💻 Equipe de Desenvolvimento

| Nome                            | Responsabilidade                                | Expectativa |
|---------------------------------|--------------------------------------------------|-------------|
| **Luiz Filipe Albuquerque Gomes** | Integração com ChatBot, Leads, Gestão           | Aplicar conhecimentos adquiridos |
| **Diogo Fontes**               | Backend do marketplace                         | Aprender novas tecnologias e softskills |
| **Antonio Saraiva**            | Backend do marketplace                         | Concluir objetivos e evoluir tecnicamente |
| **Christian Oliveira**         | Gamificação, desempenho, segurança, DevOps      | Aprimorar conhecimentos em conexões e infraestrutura |
| **Thiago Matheus**             | Frontend do marketplace                        | Aprimorar e adquirir novas habilidades práticas |
| **João Lucas**                 | Integração com ChatBot, QA                     | Aplicar e expandir conhecimento sobre SaaS e bots |
| **Gabriel Souza**              | Frontend e QA                                  | Melhorar habilidades backend e trabalho em equipe |
| **Fábio Elvino**               | Sistema de segurança e autenticação            | Aplicar tecnologias modernas e seguras |

🧑‍💼 **Líder do Projeto**: Luiz Filipe Albuquerque Gomes (ponto de contato principal)

---

## 📃 Licença

Este projeto é desenvolvido exclusivamente para fins educacionais e sem fins lucrativos.  
© 2025 - UFRPE - Ciência da Computação - Todos os direitos reservados.

---

