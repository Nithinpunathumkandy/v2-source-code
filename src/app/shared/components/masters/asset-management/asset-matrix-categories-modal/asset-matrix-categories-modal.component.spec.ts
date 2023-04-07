import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMatrixCategoriesModalComponent } from './asset-matrix-categories-modal.component';

describe('AssetMatrixCategoriesModalComponent', () => {
  let component: AssetMatrixCategoriesModalComponent;
  let fixture: ComponentFixture<AssetMatrixCategoriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMatrixCategoriesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMatrixCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
