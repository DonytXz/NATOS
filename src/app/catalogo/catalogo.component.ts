import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductItem } from './product.model'
import { Router } from '@angular/router';

import { LoginService } from '../servicios/login.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  productItem: ProductItem[] = [
    new ProductItem(1,'x20 Chep + x30 Tacon  -40%', 3960, '../../assets/promocion1.gif'),
    new ProductItem(2,'x100 Plastico -30%', 17500, '../../assets/promocion2.gif'),
    new ProductItem(3,'x20 Plastico + x30 Tacon  -40%', 3960, '../../assets/promocion1.gif'),
    new ProductItem(4,'x100 Chep -30%', 17500, '../../assets/promocion2.gif'),
    new ProductItem(5, 'x50 Chep', 9000, '../../assets/chep.jpg'),
    new ProductItem(6,'x50 Medidas especiales', 15000, '../../assets/personalizada.gif'),
    new ProductItem(7,'x50 Tacon', 7500, '../../assets/tarima1.png'),
    new ProductItem(8,'x50 Plastico', 12500, '../../assets/plastico.png'),
  ]

  @Output() cartUpdated = new EventEmitter<{
    productId: number,
    productName: string,
    productPrice: number
  }>();
  entrar: any;

  constructor(public router: Router, private loginservicio:LoginService) { }

  ngOnInit() {
    this.router.navigate(['shop']);
    this.loginservicio.change.subscribe(isOpen =>{
      this.entrar = isOpen;
    })
    this.llenarentrar();
  }
  llenarentrar(){
    this.entrar=this.loginservicio.eslogueado();

  }

  onCartUpdated(event) {
    const id = event.target.getAttribute('id');
    const index = this.productItem.findIndex(elem => elem.id == id);
    this.cartUpdated.emit({
        productId: this.productItem[index].id,
        productName: this.productItem[index].name,
        productPrice: this.productItem[index].price
      });
}


}


