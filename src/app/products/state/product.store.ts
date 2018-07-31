import { Product } from '../product';
import { Injectable } from '@angular/core';
import { ProductService } from '../product.service';
import { action, observable, runInAction } from 'mobx';

@Injectable({providedIn: 'root'})
export class ProductStore {
  @observable showProductCode = true;
  @observable.shallow products: Product[] = [];
  @observable.ref currentProduct: Product;
  @observable errorMessage = '';

  constructor(private productService: ProductService) {}

  @action
  toggleProductCode() {
    this.showProductCode = !this.showProductCode;
  }

  loadProducts() {
    this.productService.getProducts()
      .subscribe(
        products => runInAction(() => this.products = products),
        error => runInAction(() => this.errorMessage = error)
      );
  }

  @action
  setCurrentProduct(product) {
    this.currentProduct = product;
  }

  @action
  clearCurrentProduct() {
    this.currentProduct = undefined;
  }

  updateProduct(product) {
    this.productService.updateProduct(product)
      .subscribe(
        updatedProduct => runInAction(() => {
          const index = this.products.findIndex(p => p.id === product.id);
          this.products[index] = updatedProduct;
        }),
        error => runInAction(() => this.errorMessage = error)
      );
  }

  @action
  initializeNewProduct() {
    this.currentProduct = {
      id: 0,
      productName: '',
      productCode: 'New',
      description: '',
      starRating: 0
    };
  }

  createProduct(product) {
    this.productService.createProduct(product)
      .subscribe(
        newProduct => runInAction(() => {
            this.products.push(newProduct);
            this.currentProduct = newProduct;
          },
        ),
        error => runInAction(this.errorMessage = error)
      );
  }

  deleteProduct(product) {
    this.productService.deleteProduct(product.id)
      .subscribe(
        () => {
          const index = this.products.indexOf(product);
          runInAction(() => {
            this.products.splice(index, 1);
            this.currentProduct = undefined;
          });
        },
        error => runInAction(this.errorMessage = error)
      );
  }

}


