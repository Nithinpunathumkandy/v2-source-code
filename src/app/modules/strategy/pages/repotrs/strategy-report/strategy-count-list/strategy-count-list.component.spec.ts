import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyCountListComponent } from './strategy-count-list.component';

describe('StrategyCountListComponent', () => {
  let component: StrategyCountListComponent;
  let fixture: ComponentFixture<StrategyCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
