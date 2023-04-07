import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaEditComponent } from './bia-edit.component';

describe('BiaEditComponent', () => {
  let component: BiaEditComponent;
  let fixture: ComponentFixture<BiaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
