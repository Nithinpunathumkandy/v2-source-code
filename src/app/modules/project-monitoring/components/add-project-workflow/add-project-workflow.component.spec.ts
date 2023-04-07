import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectWorkflowComponent } from './add-project-workflow.component';

describe('AddProjectWorkflowComponent', () => {
  let component: AddProjectWorkflowComponent;
  let fixture: ComponentFixture<AddProjectWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
