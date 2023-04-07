import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEquipmentModalComponent } from './event-equipment-modal.component';

describe('EventEquipmentModalComponent', () => {
  let component: EventEquipmentModalComponent;
  let fixture: ComponentFixture<EventEquipmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventEquipmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEquipmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
