import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowComponent } from './audit-workflow.component';

describe('AuditWorkflowComponent', () => {
  let component: AuditWorkflowComponent;
  let fixture: ComponentFixture<AuditWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
