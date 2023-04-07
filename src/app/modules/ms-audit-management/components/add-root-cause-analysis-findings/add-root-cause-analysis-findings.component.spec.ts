import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRootCauseAnalysisFindingsComponent } from './add-root-cause-analysis-findings.component';

describe('AddRootCauseAnalysisFindingsComponent', () => {
  let component: AddRootCauseAnalysisFindingsComponent;
  let fixture: ComponentFixture<AddRootCauseAnalysisFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRootCauseAnalysisFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRootCauseAnalysisFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
