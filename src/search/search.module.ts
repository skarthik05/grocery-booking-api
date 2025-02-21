import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ENV_KEYS } from '../constants/env.constants';
import { CustomLoggerService } from '../common/logger/logger.service';
import { SearchService } from './search.service';
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get(ENV_KEYS.ELASTICSEARCH_NODE),
        auth: {
          username: configService.get(ENV_KEYS.ELASTICSEARCH_USERNAME),
          password: configService.get(ENV_KEYS.ELASTICSEARCH_PASSWORD),
        },
        index: configService.get(ENV_KEYS.ELASTICSEARCH_INDEX),
        // type: configService.get(ENV_KEYS.ELASTICSEARCH_TYPE),
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 3000,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService],
  exports: [ElasticsearchModule, SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(
    private readonly searchService: SearchService,
    private readonly logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    this.logger.log('Search module initialized');
    await this.searchService.checkConnection();
  }
}
