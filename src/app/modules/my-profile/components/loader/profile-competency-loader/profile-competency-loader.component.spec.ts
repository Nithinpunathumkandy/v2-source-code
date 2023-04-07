import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCompetencyLoaderComponent } from './profile-competency-loader.component';

describe('ProfileCompetencyLoaderComponent', () => {
  let component: ProfileCompetencyLoaderComponent;
  let fixture: ComponentFixture<ProfileCompetencyLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCompetencyLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCompetencyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
