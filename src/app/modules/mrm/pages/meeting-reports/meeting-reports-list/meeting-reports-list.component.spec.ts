import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReportsListComponent } from './meeting-reports-list.component';

describe('MeetingReportsListComponent', () => {
  let component: MeetingReportsListComponent;
  let fixture: ComponentFixture<MeetingReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingReportsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
