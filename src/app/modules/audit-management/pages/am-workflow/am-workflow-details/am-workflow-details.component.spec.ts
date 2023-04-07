import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmWorkflowDetailsComponent } from './am-workflow-details.component';

describe('AmWorkflowDetailsComponent', () => {
  let component: AmWorkflowDetailsComponent;
  let fixture: ComponentFixture<AmWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
