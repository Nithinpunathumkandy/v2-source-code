import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsCountTypeComponent } from './isms-count-type.component';

describe('IsmsCountTypeComponent', () => {
  let component: IsmsCountTypeComponent;
  let fixture: ComponentFixture<IsmsCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
