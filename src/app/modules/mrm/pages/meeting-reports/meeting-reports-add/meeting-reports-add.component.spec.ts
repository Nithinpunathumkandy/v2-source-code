import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportsAddComponent } from './meeting-reports-add.component';

describe('MeetingReportsAddComponent', () => {
  let component: MeetingReportsAddComponent;
  let fixture: ComponentFixture<MeetingReportsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
