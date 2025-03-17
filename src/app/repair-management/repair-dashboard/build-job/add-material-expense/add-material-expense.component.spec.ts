import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMaterialExpenseComponent } from './add-material-expense.component';

describe('AddMaterialExpenseComponent', () => {
  let component: AddMaterialExpenseComponent;
  let fixture: ComponentFixture<AddMaterialExpenseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialExpenseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMaterialExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
