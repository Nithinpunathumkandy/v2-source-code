import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmWorkflowAddModalComponent } from './am-workflow-add-modal.component';

describe('AmWorkflowAddModalComponent', () => {
  let component: AmWorkflowAddModalComponent;
  let fixture: ComponentFixture<AmWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
