import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidualRiskLoaderComponent } from './residual-risk-loader.component';

describe('ResidualRiskLoaderComponent', () => {
  let component: ResidualRiskLoaderComponent;
  let fixture: ComponentFixture<ResidualRiskLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidualRiskLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidualRiskLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
