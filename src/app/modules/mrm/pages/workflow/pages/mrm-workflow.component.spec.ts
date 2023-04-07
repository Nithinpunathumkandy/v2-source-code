import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrmWorkflowComponent } from './mrm-workflow.component';

describe('MrmWorkflowComponent', () => {
  let component: MrmWorkflowComponent;
  let fixture: ComponentFixture<MrmWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrmWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrmWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
