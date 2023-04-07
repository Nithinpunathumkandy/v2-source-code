import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingComponent } from './strategy-mapping.component';

describe('StrategyMappingComponent', () => {
  let component: StrategyMappingComponent;
  let fixture: ComponentFixture<StrategyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
