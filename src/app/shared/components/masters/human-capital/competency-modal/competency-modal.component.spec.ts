import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyModalComponent } from './competency-modal.component';

describe('CompetencyModalComponent', () => {
  let component: CompetencyModalComponent;
  let fixture: ComponentFixture<CompetencyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
