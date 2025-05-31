export interface AppConfig {
  port: number | string;
  jwtSecret: string;
  jwtExpiry: string;
}