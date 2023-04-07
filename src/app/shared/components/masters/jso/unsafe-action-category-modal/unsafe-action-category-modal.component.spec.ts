import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionCategoryModalComponent } from './unsafe-action-category-modal.component';

describe('UnsafeActionCategoryModalComponent', () => {
  let component: UnsafeActionCategoryModalComponent;
  let fixture: ComponentFixture<UnsafeActionCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
