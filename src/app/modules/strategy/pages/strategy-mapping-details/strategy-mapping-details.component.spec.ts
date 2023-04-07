import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingDetailsComponent } from './strategy-mapping-details.component';

describe('StrategyMappingDetailsComponent', () => {
  let component: StrategyMappingDetailsComponent;
  let fixture: ComponentFixture<StrategyMappingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
