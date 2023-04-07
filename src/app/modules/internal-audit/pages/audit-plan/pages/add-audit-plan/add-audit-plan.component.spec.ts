import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditPlanComponent } from './add-audit-plan.component';

describe('AddAuditPlanComponent', () => {
  let component: AddAuditPlanComponent;
  let fixture: ComponentFixture<AddAuditPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAuditPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
