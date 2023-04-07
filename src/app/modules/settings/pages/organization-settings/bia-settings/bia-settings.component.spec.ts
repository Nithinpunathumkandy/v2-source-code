import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaSettingsComponent } from './bia-settings.component';

describe('BiaSettingsComponent', () => {
  let component: BiaSettingsComponent;
  let fixture: ComponentFixture<BiaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
