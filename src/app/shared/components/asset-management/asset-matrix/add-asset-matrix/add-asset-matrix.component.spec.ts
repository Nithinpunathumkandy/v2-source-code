import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetMatrixComponent } from './add-asset-matrix.component';

describe('AddAssetMatrixComponent', () => {
  let component: AddAssetMatrixComponent;
  let fixture: ComponentFixture<AddAssetMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAssetMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
