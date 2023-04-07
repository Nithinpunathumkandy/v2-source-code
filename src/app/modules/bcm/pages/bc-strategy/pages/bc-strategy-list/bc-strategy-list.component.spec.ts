import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStrategyListComponent } from './bc-strategy-list.component';

describe('BcStrategyListComponent', () => {
  let component: BcStrategyListComponent;
  let fixture: ComponentFixture<BcStrategyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStrategyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
