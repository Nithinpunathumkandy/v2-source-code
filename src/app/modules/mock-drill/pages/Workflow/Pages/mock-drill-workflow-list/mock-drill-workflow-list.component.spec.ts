import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillWorkflowListComponent } from './mock-drill-workflow-list.component';

describe('MockDrillWorkflowListComponent', () => {
  let component: MockDrillWorkflowListComponent;
  let fixture: ComponentFixture<MockDrillWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
