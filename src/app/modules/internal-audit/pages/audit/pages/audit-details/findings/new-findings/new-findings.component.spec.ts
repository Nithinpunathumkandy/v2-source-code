import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFindingsComponent } from './new-findings.component';

describe('NewFindingsComponent', () => {
  let component: NewFindingsComponent;
  let fixture: ComponentFixture<NewFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
