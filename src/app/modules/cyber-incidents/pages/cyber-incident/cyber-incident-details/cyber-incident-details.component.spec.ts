import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentDetailsComponent } from './cyber-incident-details.component';

describe('CyberIncidentDetailsComponent', () => {
  let component: CyberIncidentDetailsComponent;
  let fixture: ComponentFixture<CyberIncidentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
