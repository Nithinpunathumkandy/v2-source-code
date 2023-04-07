import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingStatusComponent } from './training-status.component';

describe('TrainingStatusComponent', () => {
  let component: TrainingStatusComponent;
  let fixture: ComponentFixture<TrainingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
