import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Product } from '../../product';
import { ProductStore } from '../../state/product.store';

@Component({
  templateUrl: './product-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductShellComponent implements OnInit {

  get showProductCode(): boolean {
    return this.productStore.showProductCode;
  }

  get products(): Product[] {
    return this.productStore.products;
  }

  get currentProduct(): Product {
    return this.productStore.currentProduct;
  }

  get errorMessage(): String {
    return this.productStore.errorMessage;
  }

  constructor(public productStore: ProductStore) {}

  ngOnInit(): void {
    this.productStore.loadProducts();
  }

  checkChanged(value: boolean): void {
    this.productStore.toggleProductCode();
  }

  newProduct(): void {
    this.productStore.initializeNewProduct();
  }

  productSelected(product: Product): void {
    this.productStore.setCurrentProduct(product);
  }

  deleteProduct(product: Product): void {
    this.productStore.deleteProduct(product);
  }

  clearProduct(): void {
    this.productStore.clearCurrentProduct();
  }

  saveProduct(product: Product): void {
    this.productStore.createProduct(product);
  }

  updateProduct(product: Product): void {
    this.productStore.updateProduct(product);
  }
}
