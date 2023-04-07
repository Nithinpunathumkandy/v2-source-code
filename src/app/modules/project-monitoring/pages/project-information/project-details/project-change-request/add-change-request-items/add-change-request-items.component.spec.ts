import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChangeRequestItemsComponent } from './add-change-request-items.component';

describe('AddChangeRequestItemsComponent', () => {
  let component: AddChangeRequestItemsComponent;
  let fixture: ComponentFixture<AddChangeRequestItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChangeRequestItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChangeRequestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
