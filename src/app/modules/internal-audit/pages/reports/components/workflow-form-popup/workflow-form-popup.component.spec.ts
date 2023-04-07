import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFormPopupComponent } from './workflow-form-popup.component';

describe('WorkflowFormPopupComponent', () => {
  let component: WorkflowFormPopupComponent;
  let fixture: ComponentFixture<WorkflowFormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowFormPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
