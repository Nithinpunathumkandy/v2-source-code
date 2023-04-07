import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConformityFindingsComponent } from './non-conformity-findings.component';

describe('NonConformityFindingsComponent', () => {
  let component: NonConformityFindingsComponent;
  let fixture: ComponentFixture<NonConformityFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConformityFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConformityFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
