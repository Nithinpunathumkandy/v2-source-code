import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskMatrixRatingLevelComponent } from './isms-risk-matrix-rating-level.component';

describe('IsmsRiskMatrixRatingLevelComponent', () => {
  let component: IsmsRiskMatrixRatingLevelComponent;
  let fixture: ComponentFixture<IsmsRiskMatrixRatingLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskMatrixRatingLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskMatrixRatingLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
