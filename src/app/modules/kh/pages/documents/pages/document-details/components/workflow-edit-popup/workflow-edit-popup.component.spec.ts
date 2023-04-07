import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowEditPopupComponent } from './workflow-edit-popup.component';

describe('WorkflowEditPopupComponent', () => {
  let component: WorkflowEditPopupComponent;
  let fixture: ComponentFixture<WorkflowEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowEditPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
