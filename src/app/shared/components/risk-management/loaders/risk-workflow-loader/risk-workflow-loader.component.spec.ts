import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWorkflowLoaderComponent } from './risk-workflow-loader.component';

describe('RiskWorkflowLoaderComponent', () => {
  let component: RiskWorkflowLoaderComponent;
  let fixture: ComponentFixture<RiskWorkflowLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskWorkflowLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWorkflowLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
