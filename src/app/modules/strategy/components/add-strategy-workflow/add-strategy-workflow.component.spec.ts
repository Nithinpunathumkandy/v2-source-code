import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStrategyWorkflowComponent } from './add-strategy-workflow.component';

describe('AddStrategyWorkflowComponent', () => {
  let component: AddStrategyWorkflowComponent;
  let fixture: ComponentFixture<AddStrategyWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStrategyWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStrategyWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
