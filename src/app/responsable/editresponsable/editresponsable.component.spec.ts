import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditresponsableComponent } from './editresponsable.component';

describe('EditresponsableComponent', () => {
  let component: EditresponsableComponent;
  let fixture: ComponentFixture<EditresponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditresponsableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditresponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
