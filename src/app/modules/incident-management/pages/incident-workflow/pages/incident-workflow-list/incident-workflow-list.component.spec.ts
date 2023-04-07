import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowListComponent } from './incident-workflow-list.component';

describe('IncidentWorkflowListComponent', () => {
  let component: IncidentWorkflowListComponent;
  let fixture: ComponentFixture<IncidentWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
