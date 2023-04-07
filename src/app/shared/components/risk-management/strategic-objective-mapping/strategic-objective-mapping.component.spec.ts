import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicObjectiveMappingComponent } from './strategic-objective-mapping.component';

describe('StrategicObjectiveMappingComponent', () => {
  let component: StrategicObjectiveMappingComponent;
  let fixture: ComponentFixture<StrategicObjectiveMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicObjectiveMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicObjectiveMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
