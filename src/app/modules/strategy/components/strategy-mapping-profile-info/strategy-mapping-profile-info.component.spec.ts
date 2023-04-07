import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingProfileInfoComponent } from './strategy-mapping-profile-info.component';

describe('StrategyMappingProfileInfoComponent', () => {
  let component: StrategyMappingProfileInfoComponent;
  let fixture: ComponentFixture<StrategyMappingProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingProfileInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
