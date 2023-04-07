import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecommendationsModalComponent } from './add-recommendations-modal.component';

describe('AddRecommendationsModalComponent', () => {
  let component: AddRecommendationsModalComponent;
  let fixture: ComponentFixture<AddRecommendationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecommendationsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecommendationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
