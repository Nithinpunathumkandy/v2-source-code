import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentComponent } from './cyber-incident.component';

describe('CyberIncidentComponent', () => {
  let component: CyberIncidentComponent;
  let fixture: ComponentFixture<CyberIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
