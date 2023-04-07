import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyProfileModalLoaderComponent } from './strategy-profile-modal-loader.component';

describe('StrategyProfileModalLoaderComponent', () => {
  let component: StrategyProfileModalLoaderComponent;
  let fixture: ComponentFixture<StrategyProfileModalLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyProfileModalLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyProfileModalLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
