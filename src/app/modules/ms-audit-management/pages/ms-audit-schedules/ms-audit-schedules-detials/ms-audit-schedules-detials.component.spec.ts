import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditSchedulesDetialsComponent } from './ms-audit-schedules-detials.component';

describe('MsAuditSchedulesDetialsComponent', () => {
  let component: MsAuditSchedulesDetialsComponent;
  let fixture: ComponentFixture<MsAuditSchedulesDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditSchedulesDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditSchedulesDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
