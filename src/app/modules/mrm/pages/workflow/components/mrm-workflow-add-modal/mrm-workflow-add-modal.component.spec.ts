import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrmWorkflowAddModalComponent } from './mrm-workflow-add-modal.component';

describe('MrmWorkflowAddModalComponent', () => {
  let component: MrmWorkflowAddModalComponent;
  let fixture: ComponentFixture<MrmWorkflowAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrmWorkflowAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrmWorkflowAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
