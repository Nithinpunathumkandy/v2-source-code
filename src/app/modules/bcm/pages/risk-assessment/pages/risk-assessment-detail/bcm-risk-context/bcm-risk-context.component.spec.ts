import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskContextComponent } from './bcm-risk-context.component';

describe('BcmRiskContextComponent', () => {
  let component: BcmRiskContextComponent;
  let fixture: ComponentFixture<BcmRiskContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
