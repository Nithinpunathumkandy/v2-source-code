import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRootCauseAnalysisComponent } from './isms-root-cause-analysis.component';

describe('IsmsRootCauseAnalysisComponent', () => {
  let component: IsmsRootCauseAnalysisComponent;
  let fixture: ComponentFixture<IsmsRootCauseAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRootCauseAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRootCauseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
