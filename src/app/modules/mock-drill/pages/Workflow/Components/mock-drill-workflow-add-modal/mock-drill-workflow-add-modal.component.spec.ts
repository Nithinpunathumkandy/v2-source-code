import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillWorkflowAddModalComponent } from './mock-drill-workflow-add-modal.component';

describe('MockDrillWorkflowAddModalComponent', () => {
  let component: MockDrillWorkflowAddModalComponent;
  let fixture: ComponentFixture<MockDrillWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
