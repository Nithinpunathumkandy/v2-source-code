import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiWorkflowAddModalComponent } from './kpi-workflow-add-modal.component';

describe('KpiWorkflowAddModalComponent', () => {
  let component: KpiWorkflowAddModalComponent;
  let fixture: ComponentFixture<KpiWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
