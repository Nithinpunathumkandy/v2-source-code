import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMatrixDetailsComponent } from './asset-matrix-details.component';

describe('AssetMatrixDetailsComponent', () => {
  let component: AssetMatrixDetailsComponent;
  let fixture: ComponentFixture<AssetMatrixDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMatrixDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMatrixDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
