import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentFilePreviewComponent } from './cyber-incident-file-preview.component';

describe('CyberIncidentFilePreviewComponent', () => {
  let component: CyberIncidentFilePreviewComponent;
  let fixture: ComponentFixture<CyberIncidentFilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentFilePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
