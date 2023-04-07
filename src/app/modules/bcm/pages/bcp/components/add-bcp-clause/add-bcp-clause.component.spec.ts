import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBcpClauseComponent } from './add-bcp-clause.component';

describe('AddBcpClauseComponent', () => {
  let component: AddBcpClauseComponent;
  let fixture: ComponentFixture<AddBcpClauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBcpClauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBcpClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
