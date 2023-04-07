import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowHeadUnitAddModalComponent } from './workflow-head-unit-add-modal.component';

describe('WorkflowHeadUnitAddModalComponent', () => {
  let component: WorkflowHeadUnitAddModalComponent;
  let fixture: ComponentFixture<WorkflowHeadUnitAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowHeadUnitAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowHeadUnitAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
