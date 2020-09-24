import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxModalPage } from './checkbox-modal.page';

describe('CheckboxModalPage', () => {
  let component: CheckboxModalPage;
  let fixture: ComponentFixture<CheckboxModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
