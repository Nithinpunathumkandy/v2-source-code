import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyGroupModalComponent } from './competency-group-modal.component';

describe('CompetencyGroupModalComponent', () => {
  let component: CompetencyGroupModalComponent;
  let fixture: ComponentFixture<CompetencyGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
