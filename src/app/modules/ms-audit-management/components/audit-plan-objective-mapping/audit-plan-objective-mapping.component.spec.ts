import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanObjectiveMappingComponent } from './audit-plan-objective-mapping.component';

describe('AuditPlanObjectiveMappingComponent', () => {
  let component: AuditPlanObjectiveMappingComponent;
  let fixture: ComponentFixture<AuditPlanObjectiveMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanObjectiveMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanObjectiveMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
