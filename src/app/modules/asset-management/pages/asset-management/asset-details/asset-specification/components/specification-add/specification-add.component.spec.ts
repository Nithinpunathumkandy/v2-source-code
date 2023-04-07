import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationAddComponent } from './specification-add.component';

describe('SpecificationAddComponent', () => {
  let component: SpecificationAddComponent;
  let fixture: ComponentFixture<SpecificationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecificationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
