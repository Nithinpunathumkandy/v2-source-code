import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsLoaderComponent } from './products-loader.component';

describe('ProductsLoaderComponent', () => {
  let component: ProductsLoaderComponent;
  let fixture: ComponentFixture<ProductsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
