import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCyberIncidentImpactAnalysisCategoryComponent } from './add-cyber-incident-impact-analysis-category.component';

describe('AddCyberIncidentImpactAnalysisCategoryComponent', () => {
  let component: AddCyberIncidentImpactAnalysisCategoryComponent;
  let fixture: ComponentFixture<AddCyberIncidentImpactAnalysisCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCyberIncidentImpactAnalysisCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCyberIncidentImpactAnalysisCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
