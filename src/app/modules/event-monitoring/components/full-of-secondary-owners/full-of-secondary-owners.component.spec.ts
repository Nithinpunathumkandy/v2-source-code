import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullOfSecondaryOwnersComponent } from './full-of-secondary-owners.component';

describe('FullOfSecondaryOwnersComponent', () => {
  let component: FullOfSecondaryOwnersComponent;
  let fixture: ComponentFixture<FullOfSecondaryOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullOfSecondaryOwnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullOfSecondaryOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
