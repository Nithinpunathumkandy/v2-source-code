import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMatrixDetailsComponent } from './training-matrix-details.component';

describe('TrainingMatrixDetailsComponent', () => {
  let component: TrainingMatrixDetailsComponent;
  let fixture: ComponentFixture<TrainingMatrixDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingMatrixDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingMatrixDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
