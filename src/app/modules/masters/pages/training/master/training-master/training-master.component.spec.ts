import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMasterComponent } from './training-master.component';

describe('TrainingMasterComponent', () => {
  let component: TrainingMasterComponent;
  let fixture: ComponentFixture<TrainingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
