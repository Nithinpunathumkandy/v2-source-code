import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionSubCategoriesComponent } from './unsafe-action-sub-categories.component';

describe('UnsafeActionSubCategoriesComponent', () => {
  let component: UnsafeActionSubCategoriesComponent;
  let fixture: ComponentFixture<UnsafeActionSubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionSubCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
