import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyInitiativesComponent } from './strategy-initiatives.component';

describe('StrategyInitiativesComponent', () => {
  let component: StrategyInitiativesComponent;
  let fixture: ComponentFixture<StrategyInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyInitiativesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
