import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMatrixListComponent } from './asset-matrix-list.component';

describe('AssetMatrixListComponent', () => {
  let component: AssetMatrixListComponent;
  let fixture: ComponentFixture<AssetMatrixListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMatrixListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMatrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
