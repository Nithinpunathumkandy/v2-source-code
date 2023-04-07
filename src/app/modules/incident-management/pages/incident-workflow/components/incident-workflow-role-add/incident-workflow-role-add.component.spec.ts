import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowRoleAddComponent } from './incident-workflow-role-add.component';

describe('IncidentWorkflowRoleAddComponent', () => {
  let component: IncidentWorkflowRoleAddComponent;
  let fixture: ComponentFixture<IncidentWorkflowRoleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowRoleAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowRoleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
