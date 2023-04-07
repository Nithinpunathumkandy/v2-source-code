import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicObjectivesModalComponent } from './strategic-objectives-modal.component';

describe('StrategicObjectivesModalComponent', () => {
  let component: StrategicObjectivesModalComponent;
  let fixture: ComponentFixture<StrategicObjectivesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicObjectivesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicObjectivesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
