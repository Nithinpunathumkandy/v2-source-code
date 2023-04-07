import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestDetailsLoaerComponent } from './change-request-details-loaer.component';

describe('ChangeRequestDetailsLoaerComponent', () => {
  let component: ChangeRequestDetailsLoaerComponent;
  let fixture: ComponentFixture<ChangeRequestDetailsLoaerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestDetailsLoaerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestDetailsLoaerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
