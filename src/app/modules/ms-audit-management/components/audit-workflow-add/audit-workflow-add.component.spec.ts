import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowAddComponent } from './audit-workflow-add.component';

describe('AuditWorkflowAddComponent', () => {
  let component: AuditWorkflowAddComponent;
  let fixture: ComponentFixture<AuditWorkflowAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
