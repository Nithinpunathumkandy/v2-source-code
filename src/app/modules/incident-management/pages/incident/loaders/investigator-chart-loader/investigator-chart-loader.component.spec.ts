import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorChartLoaderComponent } from './investigator-chart-loader.component';

describe('InvestigatorChartLoaderComponent', () => {
  let component: InvestigatorChartLoaderComponent;
  let fixture: ComponentFixture<InvestigatorChartLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorChartLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorChartLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
