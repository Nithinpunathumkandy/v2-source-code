import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskScoreComponent } from './isms-risk-score.component';

describe('IsmsRiskScoreComponent', () => {
  let component: IsmsRiskScoreComponent;
  let fixture: ComponentFixture<IsmsRiskScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
