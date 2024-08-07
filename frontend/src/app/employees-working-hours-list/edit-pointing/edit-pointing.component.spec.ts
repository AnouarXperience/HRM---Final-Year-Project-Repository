import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPointingComponent } from './edit-pointing.component';

describe('EditPointingComponent', () => {
  let component: EditPointingComponent;
  let fixture: ComponentFixture<EditPointingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPointingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPointingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
