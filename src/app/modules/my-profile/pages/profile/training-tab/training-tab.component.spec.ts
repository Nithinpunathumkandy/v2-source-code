import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTabComponent } from './training-tab.component';

describe('TrainingTabComponent', () => {
  let component: TrainingTabComponent;
  let fixture: ComponentFixture<TrainingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
