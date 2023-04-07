import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrWorkflowHistoryComponent } from './cr-workflow-history.component';

describe('CrWorkflowHistoryComponent', () => {
  let component: CrWorkflowHistoryComponent;
  let fixture: ComponentFixture<CrWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
