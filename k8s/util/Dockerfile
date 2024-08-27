# FROM ubuntu:23.04

FROM tailscale/tailscale:latest

# RUN apt-get update && apt-get install -y \
#     curl \
#     unzip \
#     && rm -rf /var/lib/apt/lists/*

# RUN curl -fsSL https://tailscale.com/install.sh | sh

RUN apk update && apk add curl unzip

# CMD ["tail", "-f", "/dev/null"]
