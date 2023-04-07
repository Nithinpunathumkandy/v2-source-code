import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmResidualRiskComponent } from './bcm-residual-risk.component';

describe('BcmResidualRiskComponent', () => {
  let component: BcmResidualRiskComponent;
  let fixture: ComponentFixture<BcmResidualRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmResidualRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmResidualRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
