import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactAnalysisComponent } from './impact-analysis.component';

describe('ImpactAnalysisComponent', () => {
  let component: ImpactAnalysisComponent;
  let fixture: ComponentFixture<ImpactAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
