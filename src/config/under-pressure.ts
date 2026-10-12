import type { FastifyUnderPressureOptions } from '@fastify/under-pressure';

export const underPressureOptions: FastifyUnderPressureOptions = {
  // Retorna HTTP 503 quando algum limite é ultrapassado.
  // O valor 0 desativa a verificação correspondente.

  // Atraso máximo do event loop em milissegundos.
  maxEventLoopDelay: 1000,

  // Utilização máxima do event loop (98%).
  maxEventLoopUtilization: 0.98,

  // Mede a utilização por intervalo, não acumulada.
  eventLoopUtilizationMode: 'interval',

  // Intervalo de amostragem das métricas (ms).
  sampleInterval: 1000,

  // Cabeçalho Retry-After em segundos.
  retryAfter: 60,

  // Mensagem retornada com HTTP 503 quando o serviço está sobrecarregado.
  message: 'Serviço temporariamente indisponível. Tente novamente mais tarde.',

  // Limites de memória desativados por padrão (0).
  // Configure conforme a memória disponível no container.
  // maxHeapUsedBytes: 0,
  // maxRssBytes: 0,

  // Endpoint de health check: GET /health.
  exposeStatusRoute: {
    url: '/health',
    routeOpts: {
      logLevel: 'silent',
    },
    routeSchemaOpts: {
      hide: true,
    },
  },
};
