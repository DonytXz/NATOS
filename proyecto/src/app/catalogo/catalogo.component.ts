import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductItem } from './product.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  productItem: ProductItem[] = [
    new ProductItem(1,'20 Tarimas Chep + 30 tarimas Tacon  -40%', 3960, '../../assets/promocion1.gif'),
    new ProductItem(2,'100 tarimas de plastico -30%', 17500, '../../assets/promocion2.gif'),
    new ProductItem(3,'20 Tarimas de plastico + 30 tarimas Tacon  -40%', 3960, '../../assets/promocion1.gif'),
    new ProductItem(4,'100 tarimas chep -30%', 17500, '../../assets/promocion2.gif'),
    new ProductItem(5, 'Chep', 180, '../../assets/chep.jpg'),
    new ProductItem(6,'Medidas especiales', 300, '../../assets/personalizada.gif'),
    new ProductItem(7,'Tacon', 150, '../../assets/tarima1.png'),
    new ProductItem(8,'Plastico', 250, '../../assets/plastico.png'),
  ]

  @Output() cartUpdated = new EventEmitter<{
    productId: number,
    productName: string,
    productPrice: number
  }>();

  constructor(public router: Router) { }

  ngOnInit() {
    this.router.navigate(['shop']);
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


