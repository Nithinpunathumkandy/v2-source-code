import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditSchedulesComponent } from './audit-schedules.component';

describe('AuditSchedulesComponent', () => {
  let component: AuditSchedulesComponent;
  let fixture: ComponentFixture<AuditSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
