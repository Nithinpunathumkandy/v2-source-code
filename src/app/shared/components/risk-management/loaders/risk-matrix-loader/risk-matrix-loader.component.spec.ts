import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMatrixLoaderComponent } from './risk-matrix-loader.component';

describe('RiskMatrixLoaderComponent', () => {
  let component: RiskMatrixLoaderComponent;
  let fixture: ComponentFixture<RiskMatrixLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskMatrixLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMatrixLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
