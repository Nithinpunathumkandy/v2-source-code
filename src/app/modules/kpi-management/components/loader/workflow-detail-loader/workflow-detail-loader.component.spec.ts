import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetailLoaderComponent } from './workflow-detail-loader.component';

describe('WorkflowDetailLoaderComponent', () => {
  let component: WorkflowDetailLoaderComponent;
  let fixture: ComponentFixture<WorkflowDetailLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowDetailLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDetailLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
