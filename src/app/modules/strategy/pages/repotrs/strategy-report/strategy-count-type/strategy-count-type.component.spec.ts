import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyCountTypeComponent } from './strategy-count-type.component';

describe('StrategyCountTypeComponent', () => {
  let component: StrategyCountTypeComponent;
  let fixture: ComponentFixture<StrategyCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
