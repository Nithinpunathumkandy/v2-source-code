import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMatrixComponent } from './asset-matrix.component';

describe('AssetMatrixComponent', () => {
  let component: AssetMatrixComponent;
  let fixture: ComponentFixture<AssetMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
