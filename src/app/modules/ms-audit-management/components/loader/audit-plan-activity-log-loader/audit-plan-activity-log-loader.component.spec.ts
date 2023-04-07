import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanActivityLogLoaderComponent } from './audit-plan-activity-log-loader.component';

describe('AuditPlanActivityLogLoaderComponent', () => {
  let component: AuditPlanActivityLogLoaderComponent;
  let fixture: ComponentFixture<AuditPlanActivityLogLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanActivityLogLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanActivityLogLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
