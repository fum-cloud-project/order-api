import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PRODUCTS_PACKAGE } from '../constants';
import { IProductService, ProductData } from './product.interface';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class GrpcService implements OnModuleInit {
  constructor(@Inject(PRODUCTS_PACKAGE) private client: ClientGrpc) {}

  private productService: IProductService;

  onModuleInit() {
    this.productService =
      this.client.getService<IProductService>('ProductService');
  }

  public async getProduct(id: string): Promise<ProductData> {
    const product: Observable<ProductData> =
      await this.productService.getProductData({ id });
    return await lastValueFrom(product);
  }

  public async reduceOrder(id: string, quantity: number): Promise<void> {
    const result = await this.productService.reduceOrder({ id, quantity });
    return await lastValueFrom(result);
  }
}
