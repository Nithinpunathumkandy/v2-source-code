import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanInfoLoaderComponent } from './am-audit-plan-info-loader.component';

describe('AmAuditPlanInfoLoaderComponent', () => {
  let component: AmAuditPlanInfoLoaderComponent;
  let fixture: ComponentFixture<AmAuditPlanInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
