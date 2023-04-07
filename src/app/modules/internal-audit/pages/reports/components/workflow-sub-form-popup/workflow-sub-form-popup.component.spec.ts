import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSubFormPopupComponent } from './workflow-sub-form-popup.component';

describe('WorkflowSubFormPopupComponent', () => {
  let component: WorkflowSubFormPopupComponent;
  let fixture: ComponentFixture<WorkflowSubFormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowSubFormPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSubFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
