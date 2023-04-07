import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventSecondaryOwnersComponent } from './add-event-secondary-owners.component';

describe('AddEventSecondaryOwnersComponent', () => {
  let component: AddEventSecondaryOwnersComponent;
  let fixture: ComponentFixture<AddEventSecondaryOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventSecondaryOwnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventSecondaryOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
