import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStrategicThemesComponent } from './event-strategic-themes.component';

describe('EventStrategicThemesComponent', () => {
  let component: EventStrategicThemesComponent;
  let fixture: ComponentFixture<EventStrategicThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventStrategicThemesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStrategicThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
