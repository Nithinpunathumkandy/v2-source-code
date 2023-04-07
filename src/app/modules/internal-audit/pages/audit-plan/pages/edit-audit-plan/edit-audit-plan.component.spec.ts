import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuditPlanComponent } from './edit-audit-plan.component';

describe('EditAuditPlanComponent', () => {
  let component: EditAuditPlanComponent;
  let fixture: ComponentFixture<EditAuditPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAuditPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAuditPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
