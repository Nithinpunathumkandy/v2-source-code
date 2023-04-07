import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditSchedulesComponent } from './ms-audit-schedules.component';

describe('MsAuditSchedulesComponent', () => {
  let component: MsAuditSchedulesComponent;
  let fixture: ComponentFixture<MsAuditSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
