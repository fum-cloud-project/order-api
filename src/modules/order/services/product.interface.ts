import { Observable } from 'rxjs';

export interface ReduceOrder {
  id: string;
  quantity: number;
}

export interface ProductData {
  _id: string;
  name: string;
  price: number;
}

export interface IProductService {
  getProductData(ID: { id: string }): Observable<ProductData>;
  reduceOrder(order: ReduceOrder): Observable<void>;
}
