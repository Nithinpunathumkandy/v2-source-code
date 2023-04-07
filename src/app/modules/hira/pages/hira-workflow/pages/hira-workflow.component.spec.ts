import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraWorkflowComponent } from './hira-workflow.component';

describe('HiraWorkflowComponent', () => {
  let component: HiraWorkflowComponent;
  let fixture: ComponentFixture<HiraWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
