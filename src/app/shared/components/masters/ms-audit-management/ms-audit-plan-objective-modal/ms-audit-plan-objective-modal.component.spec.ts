import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlanObjectiveModalComponent } from './ms-audit-plan-objective-modal.component';

describe('MsAuditPlanObjectiveModalComponent', () => {
  let component: MsAuditPlanObjectiveModalComponent;
  let fixture: ComponentFixture<MsAuditPlanObjectiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlanObjectiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlanObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
