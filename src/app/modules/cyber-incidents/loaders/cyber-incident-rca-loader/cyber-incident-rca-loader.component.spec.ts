import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentRcaLoaderComponent } from './cyber-incident-rca-loader.component';

describe('CyberIncidentRcaLoaderComponent', () => {
  let component: CyberIncidentRcaLoaderComponent;
  let fixture: ComponentFixture<CyberIncidentRcaLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentRcaLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentRcaLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
