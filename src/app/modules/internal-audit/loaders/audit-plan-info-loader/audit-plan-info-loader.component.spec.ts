import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanInfoLoaderComponent } from './audit-plan-info-loader.component';

describe('AuditPlanInfoLoaderComponent', () => {
  let component: AuditPlanInfoLoaderComponent;
  let fixture: ComponentFixture<AuditPlanInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
