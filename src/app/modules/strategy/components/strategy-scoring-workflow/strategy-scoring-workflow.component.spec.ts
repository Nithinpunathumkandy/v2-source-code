import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyScoringWorkflowComponent } from './strategy-scoring-workflow.component';

describe('StrategyScoringWorkflowComponent', () => {
  let component: StrategyScoringWorkflowComponent;
  let fixture: ComponentFixture<StrategyScoringWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyScoringWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyScoringWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
