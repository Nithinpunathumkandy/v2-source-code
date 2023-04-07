import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentStatusesComponent } from './cyber-incident-statuses.component';

describe('CyberIncidentStatusesComponent', () => {
  let component: CyberIncidentStatusesComponent;
  let fixture: ComponentFixture<CyberIncidentStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
