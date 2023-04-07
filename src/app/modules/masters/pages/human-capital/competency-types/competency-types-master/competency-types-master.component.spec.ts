import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyTypesMasterComponent } from './competency-types-master.component';

describe('CompetencyTypesMasterComponent', () => {
  let component: CompetencyTypesMasterComponent;
  let fixture: ComponentFixture<CompetencyTypesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyTypesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyTypesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
