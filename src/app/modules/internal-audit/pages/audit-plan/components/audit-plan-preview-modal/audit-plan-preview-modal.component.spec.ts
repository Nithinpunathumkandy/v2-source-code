import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanPreviewModalComponent } from './audit-plan-preview-modal.component';

describe('AuditPlanPreviewModalComponent', () => {
  let component: AuditPlanPreviewModalComponent;
  let fixture: ComponentFixture<AuditPlanPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPlanPreviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
