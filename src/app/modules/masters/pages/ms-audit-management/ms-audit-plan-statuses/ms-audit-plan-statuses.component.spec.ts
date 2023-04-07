import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlanStatusesComponent } from './ms-audit-plan-statuses.component';

describe('MsAuditPlanStatusesComponent', () => {
  let component: MsAuditPlanStatusesComponent;
  let fixture: ComponentFixture<MsAuditPlanStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlanStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlanStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
