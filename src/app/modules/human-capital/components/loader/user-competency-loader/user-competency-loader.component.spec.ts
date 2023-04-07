import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompetencyLoaderComponent } from './user-competency-loader.component';

describe('UserCompetencyLoaderComponent', () => {
  let component: UserCompetencyLoaderComponent;
  let fixture: ComponentFixture<UserCompetencyLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCompetencyLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCompetencyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
