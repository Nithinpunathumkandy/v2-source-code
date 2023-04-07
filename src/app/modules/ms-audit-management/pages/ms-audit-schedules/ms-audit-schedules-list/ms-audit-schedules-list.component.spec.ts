import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditSchedulesListComponent } from './ms-audit-schedules-list.component';

describe('MsAuditSchedulesListComponent', () => {
  let component: MsAuditSchedulesListComponent;
  let fixture: ComponentFixture<MsAuditSchedulesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditSchedulesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditSchedulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
