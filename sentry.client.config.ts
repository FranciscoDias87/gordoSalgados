//sentry.client.config.ts

import * as Sentry from "@sentry/nextjs";

if (!Sentry.getClient()) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Ajuste este valor em produção, ou use tracesSampler para maior controle
    tracesSampleRate: 1,

    //
    sendDefaultPii: true,

    // Definir como true imprimirá informações úteis no console durante a configuração
    debug: false,

    replaysOnErrorSampleRate: 1.0,

    // Isso define a taxa de amostragem para 10%. Você pode querer que seja 100% em
    // desenvolvimento e uma taxa menor em produção
    replaysSessionSampleRate: 0.1,

    // Você pode remover esta opção se não planeja usar o recurso Sentry Session Replay:
    integrations: [],
  });

  // Adiciona o Replay apenas se for ambiente de navegador e se não houver um Replay ativo
  if (typeof window !== "undefined") {
    const client = Sentry.getClient();
    if (client && !client.getIntegrationByName("Replay")) {
      client.addIntegration(
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        })
      );
    }
  }
}
