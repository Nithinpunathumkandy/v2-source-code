import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpTemplateAddModalComponent } from './bcp-template-add-modal.component';

describe('BcpTemplateAddModalComponent', () => {
  let component: BcpTemplateAddModalComponent;
  let fixture: ComponentFixture<BcpTemplateAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpTemplateAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpTemplateAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
