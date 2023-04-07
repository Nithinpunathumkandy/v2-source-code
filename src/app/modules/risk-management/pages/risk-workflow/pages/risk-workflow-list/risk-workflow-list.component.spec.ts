import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWorkflowListComponent } from './risk-workflow-list.component';

describe('RiskWorkflowListComponent', () => {
  let component: RiskWorkflowListComponent;
  let fixture: ComponentFixture<RiskWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
