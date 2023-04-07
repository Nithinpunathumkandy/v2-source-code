import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCertificateModalComponent } from './profile-certificate-modal.component';

describe('ProfileCertificateModalComponent', () => {
  let component: ProfileCertificateModalComponent;
  let fixture: ComponentFixture<ProfileCertificateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCertificateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCertificateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
