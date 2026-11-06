# M1 candidate. Rebuild and verify upstream compatibility before marking accepted.
FROM node:24.22.2-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global --ignore-scripts rea-agents@6.7.0
RUN useradd --uid 10001 --create-home researcher
WORKDIR /opt/rea
COPY run.mjs /opt/rea/run.mjs
USER researcher
ENV HOME=/home/researcher
ENTRYPOINT ["node", "/opt/rea/run.mjs"]
