import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product.model';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  Math = Math;

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((searchTerm) => {
        this.productService.setSearchTerm(searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.productService.setCategory(target.value);
  }

  onPageChange(page: number): void {
    this.productService.setPage(page);
  }

  addToCart(product: Product): void {
    this.productService.addToCart(product.id);
  }

  getPageNumbers(): number[] {
    const totalPages = this.productService.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
