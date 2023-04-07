import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingListLoaderComponent } from './training-list-loader.component';

describe('TrainingListLoaderComponent', () => {
  let component: TrainingListLoaderComponent;
  let fixture: ComponentFixture<TrainingListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
