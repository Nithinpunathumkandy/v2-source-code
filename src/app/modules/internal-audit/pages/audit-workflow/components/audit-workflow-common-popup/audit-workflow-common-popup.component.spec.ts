import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowCommonPopupComponent } from './audit-workflow-common-popup.component';

describe('AuditWorkflowCommonPopupComponent', () => {
  let component: AuditWorkflowCommonPopupComponent;
  let fixture: ComponentFixture<AuditWorkflowCommonPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowCommonPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowCommonPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
