import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskRatingComponent } from './isms-risk-rating.component';

describe('IsmsRiskRatingComponent', () => {
  let component: IsmsRiskRatingComponent;
  let fixture: ComponentFixture<IsmsRiskRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
