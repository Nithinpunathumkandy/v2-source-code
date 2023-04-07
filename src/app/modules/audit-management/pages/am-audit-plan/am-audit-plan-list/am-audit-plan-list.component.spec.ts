import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanListComponent } from './am-audit-plan-list.component';

describe('AmAuditPlanListComponent', () => {
  let component: AmAuditPlanListComponent;
  let fixture: ComponentFixture<AmAuditPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
