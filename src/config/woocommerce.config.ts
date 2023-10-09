import { IsString } from 'class-validator';

export class WooCommerceConfig {
  @IsString()
  public readonly api_url!: string;

  @IsString()
  public readonly consumer_key!: string;

  @IsString()
  public readonly consumer_secret!: string;

  @IsString()
  public readonly api_version!: string;

  public getApiConfig() {
    return {
      apiUrl: this.api_url,
      apiVersion: this.api_version,
      consumerKey: this.consumer_key,
      consumerSecret: this.consumer_secret,
    };
  }
}
