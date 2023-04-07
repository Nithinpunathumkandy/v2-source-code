import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCompleteModalComponent } from './training-complete-modal.component';

describe('TrainingCompleteModalComponent', () => {
  let component: TrainingCompleteModalComponent;
  let fixture: ComponentFixture<TrainingCompleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingCompleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCompleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
