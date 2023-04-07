import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRatingsListModalComponent } from './risk-ratings-list-modal.component';

describe('RiskRatingsListModalComponent', () => {
  let component: RiskRatingsListModalComponent;
  let fixture: ComponentFixture<RiskRatingsListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRatingsListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRatingsListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
