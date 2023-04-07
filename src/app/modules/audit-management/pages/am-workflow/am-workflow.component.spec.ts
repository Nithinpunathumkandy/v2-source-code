import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmWorkflowComponent } from './am-workflow.component';

describe('AmWorkflowComponent', () => {
  let component: AmWorkflowComponent;
  let fixture: ComponentFixture<AmWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
