import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetailsLoaderComponent } from './workflow-details-loader.component';

describe('WorkflowDetailsLoaderComponent', () => {
  let component: WorkflowDetailsLoaderComponent;
  let fixture: ComponentFixture<WorkflowDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
