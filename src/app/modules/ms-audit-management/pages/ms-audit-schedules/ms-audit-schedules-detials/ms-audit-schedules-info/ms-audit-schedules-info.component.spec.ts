import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditSchedulesInfoComponent } from './ms-audit-schedules-info.component';

describe('MsAuditSchedulesInfoComponent', () => {
  let component: MsAuditSchedulesInfoComponent;
  let fixture: ComponentFixture<MsAuditSchedulesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditSchedulesInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditSchedulesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
