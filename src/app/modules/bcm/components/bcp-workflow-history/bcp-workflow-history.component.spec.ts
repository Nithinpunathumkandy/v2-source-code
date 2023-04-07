import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpWorkflowHistoryComponent } from './bcp-workflow-history.component';

describe('BcpWorkflowHistoryComponent', () => {
  let component: BcpWorkflowHistoryComponent;
  let fixture: ComponentFixture<BcpWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
