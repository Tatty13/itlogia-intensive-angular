import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currencyData = {
    dollar: {
      sign: '$',
      coefficient: 1,
    },
    ruble: {
      sign: '₽',
      coefficient: 90,
    },
    belRub: {
      sign: 'BYN',
      coefficient: 3,
    },
    euro: {
      sign: '€',
      coefficient: 0.9,
    },
    yuan: {
      sign: '¥',
      coefficient: 6.9,
    },
  }

  currency = this.currencyData.dollar.sign;

  form = this.fb.group({
    order: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  })

  productsData: any;

  constructor(private fb: FormBuilder, private appSevice: AppService) {
  }

  ngOnInit() {
    this.appSevice.getData().subscribe(data => this.productsData = data);
  }

  scrollTo(target: HTMLElement, product?: any) {
    target.scrollIntoView({behavior: 'smooth'});
    if (product) {
      this.form.patchValue({order: `${product.title} (${product.price} ${this.currency})`});
    }
  }

  confirmOrder() {
    if (this.form.valid) {
      this.appSevice.sendOrder(this.form.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message)
          },
          error: (response) => {
            alert(response.error.message)
          },
        });

      this.form.reset();
    }
  }

  changeCurrency() {
    let newCurrency = this.currencyData.dollar.sign;
    let coefficient = this.currencyData.dollar.coefficient;

    if (this.currency === this.currencyData.dollar.sign) {
      newCurrency = this.currencyData.ruble.sign;
      coefficient = this.currencyData.ruble.coefficient;
    } else if (this.currency === this.currencyData.ruble.sign) {
      newCurrency = this.currencyData.belRub.sign;
      coefficient = this.currencyData.belRub.coefficient;
    } else if (this.currency === this.currencyData.belRub.sign) {
      newCurrency = this.currencyData.euro.sign;
      coefficient = this.currencyData.euro.coefficient;
    } else if (this.currency === this.currencyData.euro.sign) {
      newCurrency = this.currencyData.yuan.sign;
      coefficient = this.currencyData.yuan.coefficient;
    }

    this.currency = newCurrency;

    this.productsData.forEach((product: any) => {
      const totalPrice = product.basePrice * coefficient;
      product.price = Number.isInteger(totalPrice) ? totalPrice : +totalPrice.toFixed(1);
    });

  }
}
