import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FranchiseOperationFooterComponent } from './franchise-operation-footer.component';

describe('FranchiseOperationFooterComponent', () => {
  let component: FranchiseOperationFooterComponent;
  let fixture: ComponentFixture<FranchiseOperationFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseOperationFooterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FranchiseOperationFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
