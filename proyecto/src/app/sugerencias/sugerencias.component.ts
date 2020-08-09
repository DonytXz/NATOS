import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit {
  asunto: string;
  nombre: string;
  correo: string;
  txt: string;
  url: string;

  getAsunto(val){
    this.asunto = val;
  }
  getNombre(val){
    this.nombre = val;
  }
  getCorreo(val){
    this.correo = val;
  }
  // getNumero(val){
  //   this.numero = val;
  // }
  getTxt(val){
    this.txt = val;
  }

  generateUrl(){
      this.url = "https://api.whatsapp.com/send?phone=+5216644198479"+"&text="+this.txt;
   }

  constructor() { }

  ngOnInit(): void {
  }

}
