import { Component, OnInit } from '@angular/core';
import { version } from 'process';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-candy-bar',
  templateUrl: './candy-bar.component.html',
  styleUrls: ['./candy-bar.component.scss']
})
export class CandyBarComponent implements OnInit {
  candyBar: any;
  selectNoPerson: number;
  selectedPrice: number;
  price: number;
  noPersons: any;
  toaster: any;
  private _httpClient: any;
  order: any;

  private SEND_ORDER = "https://tavacudetoate.ro/data/candyBar.php";

  customOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: false,
    smartSpeed: 3000,
    autoplay: true,
    dots: false,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 1
      },
      600: {
        items: 2
      },
      800: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  }
  terms: any;
  gdpr: any;
  constructor() {
    this.candyBar = [
      {
        version: [
          {
            title: 'Mini Blanche',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Tarte midi ciocolată și fructe',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Macarons diferite arome',
            description: 'x numarul de invitați'
          },
          {
            title: 'Pavlova',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Mini Ecler ciocolată',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Mini Ecler vanilie',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Cupcakes',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Panna Cotta',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Cake-Pops',
            description: '1/2 din numărul de invitați'
          },
        ],
      },
      {
        version: [
          {
            title: 'Mini Cheesecake borcan',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Macarons diferite arome',
            description: 'x numărul de invitați'
          },
          {
            title: 'Pavlova',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Tiramisu pahar',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Mini Ecler zmeură',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Mini tarte bezea și lămâie',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Mini Pistache',
            description: '1/4 din numărul de invitați'
          },
          {
            title: 'Mini Ecler cafea',
            description: '1/3 din numărul de invitați'
          },
          {
            title: 'Cake-Pops',
            description: '1/2 din numărul de invitați'
          },
        ]
      },
      {
        version: [
          {
            title: 'Cupcakes',

            description: '1/4 din numărul de invitați',
          },
          {
            title: 'Macarons diferite arome',

            description: 'x numărul de invitați',
          },
          {
            title: 'Pavlova',

            description: '1/4 din numărul de invitați',
          },
          {
            title: 'Mini Ecler fistic',

            description: '1/3 din numărul de invitați',
          },
          {
            title: 'Mini Ecler pralina',

            description: '1/3 din numărul de invitați',
          },
          {
            title: 'Mini Le Praliné',

            description: '1/4 din numărul de invitați',
          },
          {
            title: 'Mini Cheesecake fructe de pădure',

            description: '1/4 din numărul de invitați',
          },
          {
            title: 'Cake-Pops',

            description: '1/2 din numărul de invitați',
          },
          {
            title: 'Mini Millefeuille',

            description: '1/3 din numărul de invitați',
          },
        ]
      }
    ]
  }




  toggleFlip(event) {
    const parent = event.target.closest('.content-column');
    const flip = document.querySelectorAll('.content-column');
    const flips = Array.from(flip);



    for (let i in flips) {
      if (flip[i].classList.contains('flip')) {
        flip[i].classList.remove('flip')
      }

    }


    parent.classList.add('flip');
    this.selectedPrice = 0;
    this.selectNoPerson = 0;
  }

  removeFlip(event) {
    const parent = event.target.closest('.content-column');


    parent.classList.remove('flip');
    this.selectedPrice = this.price;
    this.selectNoPerson = this.noPersons;
  }

  ngOnInit(): void {
  }

  chooseNoPersons(event) {

    let order = event.target.closest('.menu-actions');
    let price = order.querySelector('.order h3');
    price.innerHTML = event.target.dataset.price;

    this.price = event.target.dataset.price;
    this.noPersons = event.target.value;


  }

  placeOrder(form: NgForm) {

    if (!form.valid) {
      this.toaster.warning('Te rugam sa completati toate campurile obligatorii!', 'Comanda nu poate fi trimisa!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    if (!this.terms) {
      this.toaster.warning('', 'Trebuie sa fii de acord cu termenii si conditiile site-ului!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    if (!this.gdpr) {
      this.toaster.warning('', 'Trebuie sa fii de acord cu politica de confidentialitate a site-ului!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    this._httpClient.post(this.SEND_ORDER, this.order).subscribe((data: any) => {
      if (data.status == "success") {

        this.toaster.success('Iti multumim!', `${data.message}`, {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });


        form.reset();
      }
    })

  }

}
