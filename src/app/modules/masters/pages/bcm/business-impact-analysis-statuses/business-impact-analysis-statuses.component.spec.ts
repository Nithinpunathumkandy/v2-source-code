import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessImpactAnalysisStatusesComponent } from './business-impact-analysis-statuses.component';

describe('BusinessImpactAnalysisStatusesComponent', () => {
  let component: BusinessImpactAnalysisStatusesComponent;
  let fixture: ComponentFixture<BusinessImpactAnalysisStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessImpactAnalysisStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessImpactAnalysisStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
