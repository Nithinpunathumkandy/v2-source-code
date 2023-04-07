import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompetenciesPageComponent } from './user-competencies-page.component';

describe('UserCompetenciesPageComponent', () => {
  let component: UserCompetenciesPageComponent;
  let fixture: ComponentFixture<UserCompetenciesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCompetenciesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCompetenciesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
