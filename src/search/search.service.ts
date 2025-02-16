import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { ENV_KEYS } from 'src/constants/env.constants';
import { Grocery } from 'src/entities/grocery.entity';

@Injectable()
export class SearchService {
  private readonly indexName: string;
  private readonly elasticsearchService: ElasticsearchService;

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
    
  ) {
    this.indexName = this.configService.get(ENV_KEYS.ELASTICSEARCH_INDEX);
    this.elasticsearchService = new ElasticsearchService({
      node: this.configService.get(ENV_KEYS.ELASTICSEARCH_NODE),
      auth: {
        username: this.configService.get(ENV_KEYS.ELASTICSEARCH_USERNAME),
        password: this.configService.get(ENV_KEYS.ELASTICSEARCH_PASSWORD),
      },
      maxRetries: 10,
      requestTimeout: 60000,
      pingTimeout: 3000,
    });
  }

  async checkConnection() {
    try {
      this.logger.log('Checking Elasticsearch connection');
      const health = await this.elasticsearchService.ping();

      this.logger.log(`Elasticsearch connection successful: ${health}`);
    } catch (error) {
      this.logger.customError(
        'Failed to connect to Elasticsearch',
        error.stack,
      );
    }
  }

  async createIndex() {
    this.logger.log('Creating index for groceries');
    const index = this.indexName;

    this.logger.log(`checking if index exists: ${index}`);
    const isIndexExists = await this.elasticsearchService.indices.exists({
      index,
    });
    this.logger.log(`Index exists: ${isIndexExists}`);
    if (isIndexExists) {
      this.logger.log('Index already exists');
      return;
    }
    this.logger.log('Index does not exist, creating index');

    try {
      await this.elasticsearchService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text' },
              price: { type: 'float' },
              quantity: { type: 'integer' },
            },
          },
        },
      });

      this.logger.log('Elasticsearch index created for groceries');
    } catch (error) {
      this.logger.customError(
        'Failed to create elasticsearch index',
        error.stack,
      );
      throw error;
    }
  }

  async indexGroceries(groceries: Grocery[]) {
    this.logger.log('Indexing groceries in Elasticsearch');

    try {
      const body = groceries.flatMap((grocery) => [
        { index: { _index: this.indexName, _id: grocery.id } },
        grocery,
      ]);

      await this.elasticsearchService.bulk({ index: this.indexName, body });

      this.logger.log('Groceries indexed in Elasticsearch');
    } catch (error) {
      this.logger.customError(
        'Failed to index groceries in Elasticsearch',
        error.stack,
      );
      throw error;
    }
  }

  async searchGroceries(query: string): Promise<Grocery[]> {
    this.logger.log(`Searching groceries with query: "${query}"`);

    try {
      const result = await this.elasticsearchService.search<Grocery>({
        index: this.indexName,
        body: {
          query: {
            bool: {
              should: [
                { match: { name: query } },
                { fuzzy: { name: { value: query, fuzziness: 2 } } },
                { wildcard: { name: `*${query}*` } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      });

      this.logger.log(`Found ${result.hits.total} groceries`);
      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      this.logger.customError(
        'Failed to search groceries in Elasticsearch',
        error.stack,
      );
      throw error;
    }
  }

  async indexGrocery(grocery: Grocery) {
    this.logger.log(`Indexing grocery: ${grocery.name}`);
    try {
      await this.elasticsearchService.index({
        index: this.indexName,
        id: grocery.id.toString(),
        document: grocery,
      });
      this.logger.log('Grocery indexed');
    } catch (error) {
      this.logger.customError(
        `Failed to index grocery ${grocery.name}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteGrocery(id: number) {
    this.logger.log(`Deleting grocery with ID: ${id}`);
    try {
      await this.elasticsearchService.delete({
        index: this.indexName,
        id: id.toString(),
      });
      this.logger.log(`Grocery deleted from Elasticsearch with ID: ${id}`);
    } catch (error) {
      this.logger.customError(`Failed to delete grocery ${id}`, error.stack);
      throw error;
    }
  }
  async updateGrocery(grocery: Grocery) {
    this.logger.log(`Updating grocery: ${grocery.name}`);
    try {
      await this.elasticsearchService.update({
        index: this.indexName,
        id: grocery.id.toString(),
        body: { doc: grocery },
      });
      this.logger.log('Grocery updated in Elasticsearch');
    } catch (error) {
      this.logger.customError(
        `Failed to update grocery ${grocery.name}`,
        error.stack,
      );
      throw error;
    }
  }
}
