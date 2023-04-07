import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileStakeholderAnalysisLoaderComponent } from './event-profile-stakeholder-analysis-loader.component';

describe('EventProfileStakeholderAnalysisLoaderComponent', () => {
  let component: EventProfileStakeholderAnalysisLoaderComponent;
  let fixture: ComponentFixture<EventProfileStakeholderAnalysisLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileStakeholderAnalysisLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileStakeholderAnalysisLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
