import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrMainClauseComponent } from './cr-main-clause.component';

describe('CrMainClauseComponent', () => {
  let component: CrMainClauseComponent;
  let fixture: ComponentFixture<CrMainClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrMainClauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrMainClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
