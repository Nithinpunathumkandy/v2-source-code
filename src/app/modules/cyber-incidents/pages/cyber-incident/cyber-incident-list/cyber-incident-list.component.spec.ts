import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentListComponent } from './cyber-incident-list.component';

describe('CyberIncidentListComponent', () => {
  let component: CyberIncidentListComponent;
  let fixture: ComponentFixture<CyberIncidentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
