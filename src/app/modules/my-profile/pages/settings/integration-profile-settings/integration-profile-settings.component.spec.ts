import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationProfileSettingsComponent } from './integration-profile-settings.component';

describe('IntegrationProfileSettingsComponent', () => {
  let component: IntegrationProfileSettingsComponent;
  let fixture: ComponentFixture<IntegrationProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationProfileSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
