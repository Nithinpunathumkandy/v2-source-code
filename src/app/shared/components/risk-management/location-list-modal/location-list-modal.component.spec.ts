import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListModalComponent } from './location-list-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LocationListModalComponent', () => {
  let component: LocationListModalComponent;
  let fixture: ComponentFixture<LocationListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ LocationListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
