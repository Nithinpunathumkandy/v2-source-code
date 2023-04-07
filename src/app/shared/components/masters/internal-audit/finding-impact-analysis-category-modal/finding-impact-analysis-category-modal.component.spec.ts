import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingImpactAnalysisCategoryModalComponent } from './finding-impact-analysis-category-modal.component';

describe('FindingImpactAnalysisCategoryModalComponent', () => {
  let component: FindingImpactAnalysisCategoryModalComponent;
  let fixture: ComponentFixture<FindingImpactAnalysisCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingImpactAnalysisCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingImpactAnalysisCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
