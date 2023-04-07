import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBcpComponent } from './add-bcp.component';

describe('AddBcpComponent', () => {
  let component: AddBcpComponent;
  let fixture: ComponentFixture<AddBcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBcpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
