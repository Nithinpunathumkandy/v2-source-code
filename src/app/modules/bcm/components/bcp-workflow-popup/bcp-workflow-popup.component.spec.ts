import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpWorkflowPopupComponent } from './bcp-workflow-popup.component';

describe('BcpWorkflowPopupComponent', () => {
  let component: BcpWorkflowPopupComponent;
  let fixture: ComponentFixture<BcpWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
