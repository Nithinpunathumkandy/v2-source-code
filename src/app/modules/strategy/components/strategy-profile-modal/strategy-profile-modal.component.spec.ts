import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyProfileModalComponent } from './strategy-profile-modal.component';

describe('StrategyProfileModalComponent', () => {
  let component: StrategyProfileModalComponent;
  let fixture: ComponentFixture<StrategyProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyProfileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
