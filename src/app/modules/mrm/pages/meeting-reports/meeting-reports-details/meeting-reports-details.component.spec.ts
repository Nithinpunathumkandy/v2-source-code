import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportsDetailsComponent } from './meeting-reports-details.component';

describe('MeetingReportsDetailsComponent', () => {
  let component: MeetingReportsDetailsComponent;
  let fixture: ComponentFixture<MeetingReportsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
