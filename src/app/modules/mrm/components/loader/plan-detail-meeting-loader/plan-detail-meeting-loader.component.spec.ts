import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailMeetingLoaderComponent } from './plan-detail-meeting-loader.component';

describe('PlanDetailMeetingLoaderComponent', () => {
  let component: PlanDetailMeetingLoaderComponent;
  let fixture: ComponentFixture<PlanDetailMeetingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanDetailMeetingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailMeetingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
