import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCorrectiveActionsComponent } from './incident-corrective-actions.component';

describe('IncidentCorrectiveActionsComponent', () => {
  let component: IncidentCorrectiveActionsComponent;
  let fixture: ComponentFixture<IncidentCorrectiveActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCorrectiveActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCorrectiveActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
