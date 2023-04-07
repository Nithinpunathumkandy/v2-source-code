import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillWorkflowDetailsComponent } from './mock-drill-workflow-details.component';

describe('MockDrillWorkflowDetailsComponent', () => {
  let component: MockDrillWorkflowDetailsComponent;
  let fixture: ComponentFixture<MockDrillWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
