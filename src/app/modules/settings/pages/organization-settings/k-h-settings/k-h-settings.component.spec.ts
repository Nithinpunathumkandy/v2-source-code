import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KHSettingsComponent } from './k-h-settings.component';

describe('KHSettingsComponent', () => {
  let component: KHSettingsComponent;
  let fixture: ComponentFixture<KHSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KHSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KHSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
