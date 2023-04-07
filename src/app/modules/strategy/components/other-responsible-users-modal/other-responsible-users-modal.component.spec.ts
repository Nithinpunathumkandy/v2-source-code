import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherResponsibleUsersModalComponent } from './other-responsible-users-modal.component';

describe('OtherResponsibleUsersModalComponent', () => {
  let component: OtherResponsibleUsersModalComponent;
  let fixture: ComponentFixture<OtherResponsibleUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherResponsibleUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherResponsibleUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
