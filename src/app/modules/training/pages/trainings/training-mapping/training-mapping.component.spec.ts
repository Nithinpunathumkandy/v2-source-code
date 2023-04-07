import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMappingComponent } from './training-mapping.component';

describe('TrainingMappingComponent', () => {
  let component: TrainingMappingComponent;
  let fixture: ComponentFixture<TrainingMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
