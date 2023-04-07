import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskTreatmentsComponent } from './isms-risk-treatments.component';

describe('IsmsRiskTreatmentsComponent', () => {
  let component: IsmsRiskTreatmentsComponent;
  let fixture: ComponentFixture<IsmsRiskTreatmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskTreatmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
