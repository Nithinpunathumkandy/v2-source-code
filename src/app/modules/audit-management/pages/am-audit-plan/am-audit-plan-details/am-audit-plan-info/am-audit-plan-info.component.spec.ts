import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanInfoComponent } from './am-audit-plan-info.component';

describe('AmAuditPlanInfoComponent', () => {
  let component: AmAuditPlanInfoComponent;
  let fixture: ComponentFixture<AmAuditPlanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
