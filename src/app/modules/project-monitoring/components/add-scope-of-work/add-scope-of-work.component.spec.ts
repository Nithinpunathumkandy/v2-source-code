import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScopeOfWorkComponent } from './add-scope-of-work.component';

describe('AddScopeOfWorkComponent', () => {
  let component: AddScopeOfWorkComponent;
  let fixture: ComponentFixture<AddScopeOfWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddScopeOfWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScopeOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
