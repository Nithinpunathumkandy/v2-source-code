import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueMasterComponent } from './issue-master.component';

describe('IssueMasterComponent', () => {
  let component: IssueMasterComponent;
  let fixture: ComponentFixture<IssueMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
