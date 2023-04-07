import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentRootCauseModalComponent } from './incident-root-cause-modal.component';

describe('IncidentRootCauseModalComponent', () => {
  let component: IncidentRootCauseModalComponent;
  let fixture: ComponentFixture<IncidentRootCauseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentRootCauseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentRootCauseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
