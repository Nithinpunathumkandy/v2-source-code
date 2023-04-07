import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentImpactAnalysisCategoryComponent } from './cyber-incident-impact-analysis-category.component';

describe('CyberIncidentImpactAnalysisCategoryComponent', () => {
  let component: CyberIncidentImpactAnalysisCategoryComponent;
  let fixture: ComponentFixture<CyberIncidentImpactAnalysisCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentImpactAnalysisCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentImpactAnalysisCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
