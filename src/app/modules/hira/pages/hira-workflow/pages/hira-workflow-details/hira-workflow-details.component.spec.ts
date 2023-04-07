import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraWorkflowDetailsComponent } from './hira-workflow-details.component';

describe('HiraWorkflowDetailsComponent', () => {
  let component: HiraWorkflowDetailsComponent;
  let fixture: ComponentFixture<HiraWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
