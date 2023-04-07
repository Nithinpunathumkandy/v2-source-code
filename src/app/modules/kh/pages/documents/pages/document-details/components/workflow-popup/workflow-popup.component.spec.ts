import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPopupComponent } from './workflow-popup.component';

describe('WorkflowPopupComponent', () => {
  let component: WorkflowPopupComponent;
  let fixture: ComponentFixture<WorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
