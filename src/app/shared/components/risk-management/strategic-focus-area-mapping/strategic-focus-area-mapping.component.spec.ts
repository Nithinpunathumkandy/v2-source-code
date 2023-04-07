import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicFocusAreaMappingComponent } from './strategic-focus-area-mapping.component';

describe('StrategicFocusAreaMappingComponent', () => {
  let component: StrategicFocusAreaMappingComponent;
  let fixture: ComponentFixture<StrategicFocusAreaMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicFocusAreaMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicFocusAreaMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
