import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanInfoComponent } from './audit-plan-info.component';

describe('AuditPlanInfoComponent', () => {
  let component: AuditPlanInfoComponent;
  let fixture: ComponentFixture<AuditPlanInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPlanInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
