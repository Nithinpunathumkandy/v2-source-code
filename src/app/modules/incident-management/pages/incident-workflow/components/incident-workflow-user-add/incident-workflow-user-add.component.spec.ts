import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowUserAddComponent } from './incident-workflow-user-add.component';

describe('IncidentWorkflowUserAddComponent', () => {
  let component: IncidentWorkflowUserAddComponent;
  let fixture: ComponentFixture<IncidentWorkflowUserAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowUserAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowUserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
