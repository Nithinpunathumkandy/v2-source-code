import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMatrixCategoriesComponent } from './asset-matrix-categories.component';

describe('AssetMatrixCategoriesComponent', () => {
  let component: AssetMatrixCategoriesComponent;
  let fixture: ComponentFixture<AssetMatrixCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMatrixCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMatrixCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
