import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowCommonPopupAddComponent } from './incident-workflow-common-popup-add.component';

describe('IncidentWorkflowCommonPopupAddComponent', () => {
  let component: IncidentWorkflowCommonPopupAddComponent;
  let fixture: ComponentFixture<IncidentWorkflowCommonPopupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowCommonPopupAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowCommonPopupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
