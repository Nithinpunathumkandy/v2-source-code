import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingImpactAnalysisCategoryComponent } from './finding-impact-analysis-category.component';

describe('FindingImpactAnalysisCategoryComponent', () => {
  let component: FindingImpactAnalysisCategoryComponent;
  let fixture: ComponentFixture<FindingImpactAnalysisCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingImpactAnalysisCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingImpactAnalysisCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
