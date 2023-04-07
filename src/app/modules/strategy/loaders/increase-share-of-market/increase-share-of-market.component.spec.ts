import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncreaseShareOfMarketComponent } from './increase-share-of-market.component';

describe('IncreaseShareOfMarketComponent', () => {
  let component: IncreaseShareOfMarketComponent;
  let fixture: ComponentFixture<IncreaseShareOfMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncreaseShareOfMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncreaseShareOfMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
