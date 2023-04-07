import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDetailsLoaderComponent } from './training-details-loader.component';

describe('TrainingDetailsLoaderComponent', () => {
  let component: TrainingDetailsLoaderComponent;
  let fixture: ComponentFixture<TrainingDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
