import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentClassificationComponent } from './cyber-incident-classification.component';

describe('CyberIncidentClassificationComponent', () => {
  let component: CyberIncidentClassificationComponent;
  let fixture: ComponentFixture<CyberIncidentClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentClassificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
