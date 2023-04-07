import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlanHistoryLoaderComponent } from './improvement-plan-history-loader.component';

describe('ImprovementPlanHistoryLoaderComponent', () => {
  let component: ImprovementPlanHistoryLoaderComponent;
  let fixture: ComponentFixture<ImprovementPlanHistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlanHistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlanHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
