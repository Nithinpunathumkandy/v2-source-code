import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderAnalysisLoaderComponent } from './stakeholder-analysis-loader.component';

describe('StakeholderAnalysisLoaderComponent', () => {
  let component: StakeholderAnalysisLoaderComponent;
  let fixture: ComponentFixture<StakeholderAnalysisLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeholderAnalysisLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderAnalysisLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
