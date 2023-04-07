import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditWorkflowEngineLoaderComponent } from './audit-workflow-engine-loader.component';

describe('AuditWorkflowEngineLoaderComponent', () => {
  let component: AuditWorkflowEngineLoaderComponent;
  let fixture: ComponentFixture<AuditWorkflowEngineLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditWorkflowEngineLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditWorkflowEngineLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
