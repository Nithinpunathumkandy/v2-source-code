import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlanLoaderComponent } from './meeting-plan-loader.component';

describe('MeetingPlanLoaderComponent', () => {
  let component: MeetingPlanLoaderComponent;
  let fixture: ComponentFixture<MeetingPlanLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPlanLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
