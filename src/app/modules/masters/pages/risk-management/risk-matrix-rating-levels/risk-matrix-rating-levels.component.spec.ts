import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMatrixRatingLevelsComponent } from './risk-matrix-rating-levels.component';

describe('RiskMatrixRatingLevelsComponent', () => {
  let component: RiskMatrixRatingLevelsComponent;
  let fixture: ComponentFixture<RiskMatrixRatingLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMatrixRatingLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMatrixRatingLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
