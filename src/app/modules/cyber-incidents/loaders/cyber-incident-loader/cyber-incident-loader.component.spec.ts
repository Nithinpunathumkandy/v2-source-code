import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentLoaderComponent } from './cyber-incident-loader.component';

describe('CyberIncidentLoaderComponent', () => {
  let component: CyberIncidentLoaderComponent;
  let fixture: ComponentFixture<CyberIncidentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
