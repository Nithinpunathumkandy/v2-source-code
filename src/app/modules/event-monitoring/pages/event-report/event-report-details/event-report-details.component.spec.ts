import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventReportDetailsComponent } from './event-report-details.component';

describe('EventReportDetailsComponent', () => {
  let component: EventReportDetailsComponent;
  let fixture: ComponentFixture<EventReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
