import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskMappingComponent } from './bcm-risk-mapping.component';

describe('BcmRiskMappingComponent', () => {
  let component: BcmRiskMappingComponent;
  let fixture: ComponentFixture<BcmRiskMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
