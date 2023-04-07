import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStrategyDetailsComponent } from './bc-strategy-details.component';

describe('BcStrategyDetailsComponent', () => {
  let component: BcStrategyDetailsComponent;
  let fixture: ComponentFixture<BcStrategyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStrategyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStrategyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
