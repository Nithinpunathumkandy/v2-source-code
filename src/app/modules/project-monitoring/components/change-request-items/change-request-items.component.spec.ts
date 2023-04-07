import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestItemsComponent } from './change-request-items.component';

describe('ChangeRequestItemsComponent', () => {
  let component: ChangeRequestItemsComponent;
  let fixture: ComponentFixture<ChangeRequestItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
