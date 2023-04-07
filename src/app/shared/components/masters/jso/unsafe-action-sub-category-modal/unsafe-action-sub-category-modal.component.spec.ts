import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionSubCategoryModalComponent } from './unsafe-action-sub-category-modal.component';

describe('UnsafeActionSubCategoryModalComponent', () => {
  let component: UnsafeActionSubCategoryModalComponent;
  let fixture: ComponentFixture<UnsafeActionSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionSubCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
