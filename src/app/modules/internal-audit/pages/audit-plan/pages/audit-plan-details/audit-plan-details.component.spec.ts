import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanDetailsComponent } from './audit-plan-details.component';

describe('AuditPlanDetailsComponent', () => {
  let component: AuditPlanDetailsComponent;
  let fixture: ComponentFixture<AuditPlanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPlanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
