# backend-games/Dockerfile
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest
WORKDIR /app

# copia o binário compilado
COPY --from=builder /app/server .

# define porta padrão
ENV PORT=8090

EXPOSE 8090

CMD ["./server"]
