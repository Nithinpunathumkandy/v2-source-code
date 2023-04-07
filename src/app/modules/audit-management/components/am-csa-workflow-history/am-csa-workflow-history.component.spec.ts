import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmCsaWorkflowHistoryComponent } from './am-csa-workflow-history.component';

describe('AmCsaWorkflowHistoryComponent', () => {
  let component: AmCsaWorkflowHistoryComponent;
  let fixture: ComponentFixture<AmCsaWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmCsaWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmCsaWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
