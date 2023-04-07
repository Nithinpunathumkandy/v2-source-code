import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingProfileLoaderComponent } from './strategy-mapping-profile-loader.component';

describe('StrategyMappingProfileLoaderComponent', () => {
  let component: StrategyMappingProfileLoaderComponent;
  let fixture: ComponentFixture<StrategyMappingProfileLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingProfileLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingProfileLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
