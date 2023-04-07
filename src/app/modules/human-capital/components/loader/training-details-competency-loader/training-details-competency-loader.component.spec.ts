import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDetailsCompetencyLoaderComponent } from './training-details-competency-loader.component';

describe('TrainingDetailsCompetencyLoaderComponent', () => {
  let component: TrainingDetailsCompetencyLoaderComponent;
  let fixture: ComponentFixture<TrainingDetailsCompetencyLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDetailsCompetencyLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDetailsCompetencyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
