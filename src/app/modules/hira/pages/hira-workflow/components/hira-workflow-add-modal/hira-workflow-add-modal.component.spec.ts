import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraWorkflowAddModalComponent } from './hira-workflow-add-modal.component';

describe('HiraWorkflowAddModalComponent', () => {
  let component: HiraWorkflowAddModalComponent;
  let fixture: ComponentFixture<HiraWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
