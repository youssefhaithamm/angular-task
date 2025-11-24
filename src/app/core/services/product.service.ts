import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/product.model';
import { MOCK_PRODUCTS } from '../../mocks/products.mock';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _products = signal<Product[]>(MOCK_PRODUCTS);
  private _loading = signal<boolean>(false);
  private _searchTerm = signal<string>('');
  private _selectedCategory = signal<string>('all');
  private _currentPage = signal<number>(1);
  private readonly itemsPerPage = 10;

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();

  readonly filteredProducts = computed(() => {
    const products = this._products();
    const search = this._searchTerm().toLowerCase().trim();
    const category = this._selectedCategory();

    return products.filter((product) => {
      const matchesSearch =
        !search || product.name.toLowerCase().includes(search);
      const matchesCategory =
        category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  });

  readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const page = this._currentPage();
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  });

  readonly totalProducts = computed(() => this._products().length);

  readonly productsInStock = computed(() => {
    return this._products().filter((p) => p.inStock).length;
  });

  readonly averagePrice = computed(() => {
    const products = this._products();
    if (products.length === 0) return 0;
    const sum = products.reduce((acc, p) => acc + p.price, 0);
    return sum / products.length;
  });

  readonly recentProducts = computed(() => {
    return [...this._products()].slice(-5).reverse();
  });

  readonly categories = computed(() => {
    const categories = new Set(this._products().map((p) => p.category));
    return Array.from(categories).sort();
  });

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1);
  }

  setCategory(category: string): void {
    this._selectedCategory.set(category);
    this._currentPage.set(1);
  }

  setPage(page: number): void {
    const totalPages = this.totalPages();
    if (page >= 1 && page <= totalPages) {
      this._currentPage.set(page);
    }
  }

  getProductById(id: number): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  updateProduct(updatedProduct: Product): void {
    this._loading.set(true);

    setTimeout(() => {
      const products = this._products();
      const index = products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        const newProducts = [...products];
        newProducts[index] = updatedProduct;
        this._products.set(newProducts);
      }
      this._loading.set(false);
    }, 300);
  }

  addToCart(productId: number): void {
    console.log('Added to cart:', productId);
  }
}
