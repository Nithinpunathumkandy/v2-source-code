import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowLoaderComponent } from './incident-workflow-loader.component';

describe('IncidentWorkflowLoaderComponent', () => {
  let component: IncidentWorkflowLoaderComponent;
  let fixture: ComponentFixture<IncidentWorkflowLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
