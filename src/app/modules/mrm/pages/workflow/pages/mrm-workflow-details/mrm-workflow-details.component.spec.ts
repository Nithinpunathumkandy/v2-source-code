import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrmWorkflowDetailsComponent } from './mrm-workflow-details.component';

describe('MrmWorkflowDetailsComponent', () => {
  let component: MrmWorkflowDetailsComponent;
  let fixture: ComponentFixture<MrmWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrmWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrmWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
