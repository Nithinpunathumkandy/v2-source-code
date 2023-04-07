import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpTemplateListComponent } from './bcp-template-list.component';

describe('BcpTemplateListComponent', () => {
  let component: BcpTemplateListComponent;
  let fixture: ComponentFixture<BcpTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
