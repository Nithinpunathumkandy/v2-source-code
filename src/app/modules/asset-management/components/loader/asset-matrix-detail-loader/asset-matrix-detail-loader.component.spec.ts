import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMatrixDetailLoaderComponent } from './asset-matrix-detail-loader.component';

describe('AssetMatrixDetailLoaderComponent', () => {
  let component: AssetMatrixDetailLoaderComponent;
  let fixture: ComponentFixture<AssetMatrixDetailLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMatrixDetailLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMatrixDetailLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
