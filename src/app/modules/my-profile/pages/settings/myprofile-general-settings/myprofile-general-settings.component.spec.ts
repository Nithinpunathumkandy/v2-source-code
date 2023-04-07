import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofileGeneralSettingsComponent } from './myprofile-general-settings.component';

describe('MyprofileGeneralSettingsComponent', () => {
  let component: MyprofileGeneralSettingsComponent;
  let fixture: ComponentFixture<MyprofileGeneralSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyprofileGeneralSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyprofileGeneralSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
