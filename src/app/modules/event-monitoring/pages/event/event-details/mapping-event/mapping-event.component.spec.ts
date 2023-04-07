import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingEventComponent } from './mapping-event.component';

describe('MappingEventComponent', () => {
  let component: MappingEventComponent;
  let fixture: ComponentFixture<MappingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
