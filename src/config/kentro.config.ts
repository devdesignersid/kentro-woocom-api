import { IsString } from 'class-validator';

export class KentroConfig {
  @IsString()
  public readonly api_url!: string;

  @IsString()
  public readonly api_key!: string;

  @IsString()
  public readonly api_secret!: string;

  @IsString()
  public readonly api_version!: string;

  public getApiConfig() {
    return {
      apiUrl: this.api_url,
      apiKey: this.api_key,
      apiSecret: this.api_secret,
      apiVersion: this.api_version,
    };
  }
}
