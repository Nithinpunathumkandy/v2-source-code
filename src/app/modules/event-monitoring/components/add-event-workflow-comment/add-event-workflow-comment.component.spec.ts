import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventWorkflowCommentComponent } from './add-event-workflow-comment.component';

describe('AddEventWorkflowCommentComponent', () => {
  let component: AddEventWorkflowCommentComponent;
  let fixture: ComponentFixture<AddEventWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
