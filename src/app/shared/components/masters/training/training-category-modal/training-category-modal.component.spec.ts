import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCategoryModalComponent } from './training-category-modal.component';

describe('TrainingCategoryModalComponent', () => {
  let component: TrainingCategoryModalComponent;
  let fixture: ComponentFixture<TrainingCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
