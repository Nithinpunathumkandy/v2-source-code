import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaListComponent } from './bia-list.component';

describe('BiaListComponent', () => {
  let component: BiaListComponent;
  let fixture: ComponentFixture<BiaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
