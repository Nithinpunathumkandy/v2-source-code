import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiWorkflowListComponent } from './kpi-workflow-list.component';

describe('KpiWorkflowListComponent', () => {
  let component: KpiWorkflowListComponent;
  let fixture: ComponentFixture<KpiWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
