/* eslint-disable @typescript-eslint/no-unsafe-argument */

export function normalize(config) {
  config.app.port = Number.parseInt(config.app.port, 10);

  return config;
}
