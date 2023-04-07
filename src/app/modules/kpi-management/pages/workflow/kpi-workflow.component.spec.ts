import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiWorkflowComponent } from './kpi-workflow.component';

describe('KpiWorkflowComponent', () => {
  let component: KpiWorkflowComponent;
  let fixture: ComponentFixture<KpiWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
