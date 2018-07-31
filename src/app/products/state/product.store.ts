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

  constructor(private productService: ProductService) {
  }

  @action
  toggleProductCode() {
    this.showProductCode = !this.showProductCode;
  }

  @action
  setCurrentProduct(product) {
    this.currentProduct = product;
  }

  @action
  clearCurrentProduct() {
    this.currentProduct = undefined;
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

  async loadProducts() {
    try {
      const products = await this.productService.getProducts().toPromise();
      runInAction(() => this.products = products);
    }
    catch (error) {
      runInAction(() => this.errorMessage = error);
    }
  }

  async updateProduct(product) {
    try {
      const updatedProduct = await this.productService.updateProduct(product).toPromise();
      runInAction(() => {
        const index = this.products.findIndex(p => p.id === product.id);
        this.products[index] = updatedProduct;
      });
    }
    catch (error) {
      runInAction(() => this.errorMessage = error);
    }
  }

  async createProduct(product) {
    try {
      const newProduct = await this.productService.createProduct(product).toPromise();

      runInAction(() => {
        this.products.push(newProduct);
        this.currentProduct = newProduct;
      });
    }
    catch (error) {
      runInAction(this.errorMessage = error);
    }
  }

  async deleteProduct(product) {
    try {
      await this.productService.deleteProduct(product.id);
      const index = this.products.indexOf(product);
      runInAction(() => {
        this.products.splice(index, 1);
        this.currentProduct = undefined;
      });
    }
    catch (error) {
      runInAction(this.errorMessage = error);
    }
  }

}


