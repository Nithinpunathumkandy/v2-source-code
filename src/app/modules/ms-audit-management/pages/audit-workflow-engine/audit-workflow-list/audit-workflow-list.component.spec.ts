import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowListComponent } from './audit-workflow-list.component';

describe('AuditWorkflowListComponent', () => {
  let component: AuditWorkflowListComponent;
  let fixture: ComponentFixture<AuditWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
