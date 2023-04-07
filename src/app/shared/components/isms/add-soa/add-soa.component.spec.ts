import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSoaComponent } from './add-soa.component';

describe('AddSoaComponent', () => {
  let component: AddSoaComponent;
  let fixture: ComponentFixture<AddSoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSoaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
