import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferencesModalComponent } from './add-references-modal.component';

describe('AddReferencesModalComponent', () => {
  let component: AddReferencesModalComponent;
  let fixture: ComponentFixture<AddReferencesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReferencesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
