import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapSourceComponent } from './heat-map-source.component';

describe('HeatMapSourceComponent', () => {
  let component: HeatMapSourceComponent;
  let fixture: ComponentFixture<HeatMapSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatMapSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
