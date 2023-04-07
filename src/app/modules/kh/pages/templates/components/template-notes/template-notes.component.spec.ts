import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateNotesComponent } from './template-notes.component';

describe('TemplateNotesComponent', () => {
  let component: TemplateNotesComponent;
  let fixture: ComponentFixture<TemplateNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
