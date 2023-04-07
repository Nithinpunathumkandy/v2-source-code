import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlanObjectivesComponent } from './ms-audit-plan-objectives.component';

describe('MsAuditPlanObjectivesComponent', () => {
  let component: MsAuditPlanObjectivesComponent;
  let fixture: ComponentFixture<MsAuditPlanObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlanObjectivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlanObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
