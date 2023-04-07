import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCauseAnalysisComponent } from './root-cause-analysis.component';

describe('RootCauseAnalysisComponent', () => {
  let component: RootCauseAnalysisComponent;
  let fixture: ComponentFixture<RootCauseAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RootCauseAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCauseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
