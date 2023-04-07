import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactAnalysisCategoriesComponent } from './impact-analysis-categories.component';

describe('ImpactAnalysisCategoriesComponent', () => {
  let component: ImpactAnalysisCategoriesComponent;
  let fixture: ComponentFixture<ImpactAnalysisCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactAnalysisCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactAnalysisCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
