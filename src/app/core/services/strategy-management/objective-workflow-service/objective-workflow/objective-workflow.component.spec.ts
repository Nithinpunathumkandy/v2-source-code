import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveWorkflowComponent } from './objective-workflow.component';

describe('ObjectiveWorkflowComponent', () => {
  let component: ObjectiveWorkflowComponent;
  let fixture: ComponentFixture<ObjectiveWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
