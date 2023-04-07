import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowEngineComponent } from './audit-workflow-engine.component';

describe('AuditWorkflowEngineComponent', () => {
  let component: AuditWorkflowEngineComponent;
  let fixture: ComponentFixture<AuditWorkflowEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
