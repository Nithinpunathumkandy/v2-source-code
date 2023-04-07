import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGoiningProfilesComponent } from './on-goining-profiles.component';

describe('OnGoiningProfilesComponent', () => {
  let component: OnGoiningProfilesComponent;
  let fixture: ComponentFixture<OnGoiningProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnGoiningProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnGoiningProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
