import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowTeamAddModalComponent } from './audit-workflow-team-add-modal.component';

describe('AuditWorkflowTeamAddModalComponent', () => {
  let component: AuditWorkflowTeamAddModalComponent;
  let fixture: ComponentFixture<AuditWorkflowTeamAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowTeamAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowTeamAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
