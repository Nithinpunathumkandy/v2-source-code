import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuditeesComponent } from './add-auditees.component';

describe('AddAuditeesComponent', () => {
  let component: AddAuditeesComponent;
  let fixture: ComponentFixture<AddAuditeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAuditeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuditeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
