import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmCsaWorkflowComponent } from './am-csa-workflow.component';

describe('AmCsaWorkflowComponent', () => {
  let component: AmCsaWorkflowComponent;
  let fixture: ComponentFixture<AmCsaWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmCsaWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmCsaWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
