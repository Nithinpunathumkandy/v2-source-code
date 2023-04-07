import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanModalComponent } from './am-audit-plan-modal.component';

describe('AmAuditPlanModalComponent', () => {
  let component: AmAuditPlanModalComponent;
  let fixture: ComponentFixture<AmAuditPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
