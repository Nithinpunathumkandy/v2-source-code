import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalUsersModalComponent } from './external-users-modal.component';

describe('ExternalUsersModalComponent', () => {
  let component: ExternalUsersModalComponent;
  let fixture: ComponentFixture<ExternalUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
