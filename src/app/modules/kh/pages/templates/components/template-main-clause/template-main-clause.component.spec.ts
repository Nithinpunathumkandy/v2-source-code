import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateMainClauseComponent } from './template-main-clause.component';

describe('TemplateMainClauseComponent', () => {
  let component: TemplateMainClauseComponent;
  let fixture: ComponentFixture<TemplateMainClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateMainClauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateMainClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
