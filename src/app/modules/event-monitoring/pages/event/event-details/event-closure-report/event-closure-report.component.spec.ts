import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureReportComponent } from './event-closure-report.component';

describe('EventClosureReportComponent', () => {
  let component: EventClosureReportComponent;
  let fixture: ComponentFixture<EventClosureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
