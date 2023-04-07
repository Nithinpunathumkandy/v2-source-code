import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraWorkflowListComponent } from './hira-workflow-list.component';

describe('HiraWorkflowListComponent', () => {
  let component: HiraWorkflowListComponent;
  let fixture: ComponentFixture<HiraWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
