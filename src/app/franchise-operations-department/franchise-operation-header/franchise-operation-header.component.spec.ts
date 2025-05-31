import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FranchiseOperationHeaderComponent } from './franchise-operation-header.component';

describe('FranchiseOperationHeaderComponent', () => {
  let component: FranchiseOperationHeaderComponent;
  let fixture: ComponentFixture<FranchiseOperationHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseOperationHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseOperationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
