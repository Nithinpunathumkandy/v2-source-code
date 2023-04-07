import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillWorkflowComponent } from './mock-drill-workflow.component';

describe('MockDrillWorkflowComponent', () => {
  let component: MockDrillWorkflowComponent;
  let fixture: ComponentFixture<MockDrillWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
