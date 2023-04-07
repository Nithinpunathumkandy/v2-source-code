import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSectionComponentComponent } from './add-section-component.component';

describe('AddSectionComponentComponent', () => {
  let component: AddSectionComponentComponent;
  let fixture: ComponentFixture<AddSectionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSectionComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
