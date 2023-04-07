import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiWorkflowDetailsComponent } from './kpi-workflow-details.component';

describe('KpiWorkflowDetailsComponent', () => {
  let component: KpiWorkflowDetailsComponent;
  let fixture: ComponentFixture<KpiWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
