import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditTestPlanLoaderComponent } from './am-audit-test-plan-loader.component';

describe('AmAuditTestPlanLoaderComponent', () => {
  let component: AmAuditTestPlanLoaderComponent;
  let fixture: ComponentFixture<AmAuditTestPlanLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditTestPlanLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditTestPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
