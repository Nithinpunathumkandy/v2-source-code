import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactAnalysisDetailsComponent } from './impact-analysis-details.component';

describe('ImpactAnalysisDetailsComponent', () => {
  let component: ImpactAnalysisDetailsComponent;
  let fixture: ComponentFixture<ImpactAnalysisDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactAnalysisDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactAnalysisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
