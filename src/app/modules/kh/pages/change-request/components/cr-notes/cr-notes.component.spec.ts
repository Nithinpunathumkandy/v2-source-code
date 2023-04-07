import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrNotesComponent } from './cr-notes.component';

describe('CrNotesComponent', () => {
  let component: CrNotesComponent;
  let fixture: ComponentFixture<CrNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
