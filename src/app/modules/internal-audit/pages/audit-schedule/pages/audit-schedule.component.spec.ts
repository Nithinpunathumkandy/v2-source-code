import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditScheduleComponent } from './audit-schedule.component';

describe('AuditScheduleComponent', () => {
  let component: AuditScheduleComponent;
  let fixture: ComponentFixture<AuditScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
