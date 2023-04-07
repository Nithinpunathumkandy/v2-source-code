import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWorkflowAddModalComponent } from './risk-workflow-add-modal.component';

describe('RiskWorkflowAddModalComponent', () => {
  let component: RiskWorkflowAddModalComponent;
  let fixture: ComponentFixture<RiskWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
