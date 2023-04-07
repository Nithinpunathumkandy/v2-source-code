import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingStatusModalComponent } from './training-status-modal.component';

describe('TrainingStatusModalComponent', () => {
  let component: TrainingStatusModalComponent;
  let fixture: ComponentFixture<TrainingStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
