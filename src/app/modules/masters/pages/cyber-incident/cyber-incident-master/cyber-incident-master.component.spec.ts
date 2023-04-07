import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentMasterComponent } from './cyber-incident-master.component';

describe('CyberIncidentMasterComponent', () => {
  let component: CyberIncidentMasterComponent;
  let fixture: ComponentFixture<CyberIncidentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
