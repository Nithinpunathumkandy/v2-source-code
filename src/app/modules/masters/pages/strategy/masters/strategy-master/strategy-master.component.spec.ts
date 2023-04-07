import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMasterComponent } from './strategy-master.component';

describe('StrategyMasterComponent', () => {
  let component: StrategyMasterComponent;
  let fixture: ComponentFixture<StrategyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
