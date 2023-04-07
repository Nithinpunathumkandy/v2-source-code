import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceWorkflowLoaderComponent } from './compliance-workflow-loader.component';

describe('ComplianceWorkflowLoaderComponent', () => {
  let component: ComplianceWorkflowLoaderComponent;
  let fixture: ComponentFixture<ComplianceWorkflowLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceWorkflowLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceWorkflowLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
