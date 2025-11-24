import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  editMode = signal<boolean>(false);
  productForm!: FormGroup;
  productId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      description: [''],
      image: [''],
      inStock: [true],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.loadProduct();
    }
  }

  loadProduct(): void {
    if (this.productId) {
      const product = this.productService.getProductById(this.productId);
      if (product) {
        this.product.set(product);
        this.productForm.patchValue(product);
      } else {
        this.router.navigate(['/products']);
      }
    }
  }

  toggleEditMode(): void {
    this.editMode.set(!this.editMode());
    if (this.editMode()) {
    } else {
      const product = this.product();
      if (product) {
        this.productForm.patchValue(product);
      }
    }
  }

  saveProduct(): void {
    if (this.productForm.valid && this.productId) {
      const updatedProduct: Product = {
        ...this.product()!,
        ...this.productForm.value,
      };
      this.productService.updateProduct(updatedProduct);
      this.product.set(updatedProduct);
      this.editMode.set(false);
    } else {
      Object.keys(this.productForm.controls).forEach((key) => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  cancelEdit(): void {
    const product = this.product();
    if (product) {
      this.productForm.patchValue(product);
    }
    this.editMode.set(false);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    if (field?.hasError('min') && field?.touched) {
      return 'Price must be a positive number';
    }
    return '';
  }
}
