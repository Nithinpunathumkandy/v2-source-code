import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditSchedulesAddComponent } from './ms-audit-schedules-add.component';

describe('MsAuditSchedulesAddComponent', () => {
  let component: MsAuditSchedulesAddComponent;
  let fixture: ComponentFixture<MsAuditSchedulesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditSchedulesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditSchedulesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
