import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiWorkflowCommentComponent } from './kpi-workflow-comment.component';

describe('KpiWorkflowCommentComponent', () => {
  let component: KpiWorkflowCommentComponent;
  let fixture: ComponentFixture<KpiWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
