import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowLoaderComponent } from './workflow-loader.component';

describe('WorkflowLoaderComponent', () => {
  let component: WorkflowLoaderComponent;
  let fixture: ComponentFixture<WorkflowLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
