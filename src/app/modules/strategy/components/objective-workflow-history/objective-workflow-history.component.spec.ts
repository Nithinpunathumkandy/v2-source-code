import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveWorkflowHistoryComponent } from './objective-workflow-history.component';

describe('ObjectiveWorkflowHistoryComponent', () => {
  let component: ObjectiveWorkflowHistoryComponent;
  let fixture: ComponentFixture<ObjectiveWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
