import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrCommentsFormComponent } from './cr-comments-form.component';

describe('CrCommentsFormComponent', () => {
  let component: CrCommentsFormComponent;
  let fixture: ComponentFixture<CrCommentsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrCommentsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrCommentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
