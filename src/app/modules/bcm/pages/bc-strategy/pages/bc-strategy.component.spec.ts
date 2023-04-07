import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStrategyComponent } from './bc-strategy.component';

describe('BcStrategyComponent', () => {
  let component: BcStrategyComponent;
  let fixture: ComponentFixture<BcStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
