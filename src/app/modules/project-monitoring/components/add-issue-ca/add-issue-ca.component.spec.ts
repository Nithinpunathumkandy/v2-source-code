import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueCaComponent } from './add-issue-ca.component';

describe('AddIssueCaComponent', () => {
  let component: AddIssueCaComponent;
  let fixture: ComponentFixture<AddIssueCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIssueCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIssueCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
