import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryModalComponent } from './product-category-modal.component';

describe('ProductCategoryModalComponent', () => {
  let component: ProductCategoryModalComponent;
  let fixture: ComponentFixture<ProductCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
