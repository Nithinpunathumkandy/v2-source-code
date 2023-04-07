import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicObjectivesComponent } from './strategic-objectives.component';

describe('StrategicObjectivesComponent', () => {
  let component: StrategicObjectivesComponent;
  let fixture: ComponentFixture<StrategicObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicObjectivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
