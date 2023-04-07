import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderAnalysisComponent } from './stakeholder-analysis.component';

describe('StakeholderAnalysisComponent', () => {
  let component: StakeholderAnalysisComponent;
  let fixture: ComponentFixture<StakeholderAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
