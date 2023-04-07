import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyIndividualWorkflowLoaderComponent } from './strategy-individual-workflow-loader.component';

describe('StrategyIndividualWorkflowLoaderComponent', () => {
  let component: StrategyIndividualWorkflowLoaderComponent;
  let fixture: ComponentFixture<StrategyIndividualWorkflowLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyIndividualWorkflowLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyIndividualWorkflowLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
