import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLevelSettingsComponent } from './organization-level-settings.component';

describe('OrganizationLevelSettingsComponent', () => {
  let component: OrganizationLevelSettingsComponent;
  let fixture: ComponentFixture<OrganizationLevelSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationLevelSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationLevelSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
