import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FranchiseOperationsDepartmentComponent } from './franchise-operations-department.component';

describe('FranchiseOperationsDepartmentComponent', () => {
  let component: FranchiseOperationsDepartmentComponent;
  let fixture: ComponentFixture<FranchiseOperationsDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseOperationsDepartmentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseOperationsDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
