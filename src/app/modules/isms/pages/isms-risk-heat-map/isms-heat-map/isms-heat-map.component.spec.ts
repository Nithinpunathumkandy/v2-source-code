import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsHeatMapComponent } from './isms-heat-map.component';

describe('IsmsHeatMapComponent', () => {
  let component: IsmsHeatMapComponent;
  let fixture: ComponentFixture<IsmsHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsHeatMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
