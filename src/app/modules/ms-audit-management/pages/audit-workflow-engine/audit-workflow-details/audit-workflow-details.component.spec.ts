import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowDetailsComponent } from './audit-workflow-details.component';

describe('AuditWorkflowDetailsComponent', () => {
  let component: AuditWorkflowDetailsComponent;
  let fixture: ComponentFixture<AuditWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
