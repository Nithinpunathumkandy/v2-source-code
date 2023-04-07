import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskDetailsComponent } from './isms-risk-details.component';

describe('IsmsRiskDetailsComponent', () => {
  let component: IsmsRiskDetailsComponent;
  let fixture: ComponentFixture<IsmsRiskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
