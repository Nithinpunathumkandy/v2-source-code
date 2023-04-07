import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInfoComponent } from './strategy-info.component';

describe('StrategyInfoComponent', () => {
  let component: StrategyInfoComponent;
  let fixture: ComponentFixture<StrategyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
