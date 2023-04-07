import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileStakeholderAnalysisMatrixLoaderComponent } from './event-profile-stakeholder-analysis-matrix-loader.component';

describe('EventProfileStakeholderAnalysisMatrixLoaderComponent', () => {
  let component: EventProfileStakeholderAnalysisMatrixLoaderComponent;
  let fixture: ComponentFixture<EventProfileStakeholderAnalysisMatrixLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileStakeholderAnalysisMatrixLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileStakeholderAnalysisMatrixLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
