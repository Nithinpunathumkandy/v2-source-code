import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentRootCauseComponent } from './incident-root-cause.component';

describe('IncidentRootCauseComponent', () => {
  let component: IncidentRootCauseComponent;
  let fixture: ComponentFixture<IncidentRootCauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentRootCauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentRootCauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
