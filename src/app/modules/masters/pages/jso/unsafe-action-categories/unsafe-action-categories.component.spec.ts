import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionCategoriesComponent } from './unsafe-action-categories.component';

describe('UnsafeActionCategoriesComponent', () => {
  let component: UnsafeActionCategoriesComponent;
  let fixture: ComponentFixture<UnsafeActionCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
