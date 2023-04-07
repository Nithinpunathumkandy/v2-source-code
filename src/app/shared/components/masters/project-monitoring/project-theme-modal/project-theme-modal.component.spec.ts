import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectThemeModalComponent } from './project-theme-modal.component';

describe('ProjectThemeModalComponent', () => {
  let component: ProjectThemeModalComponent;
  let fixture: ComponentFixture<ProjectThemeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectThemeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectThemeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
