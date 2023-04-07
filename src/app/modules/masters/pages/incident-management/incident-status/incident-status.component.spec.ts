import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentStatusComponent } from './incident-status.component';

describe('IncidentStatusComponent', () => {
  let component: IncidentStatusComponent;
  let fixture: ComponentFixture<IncidentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
