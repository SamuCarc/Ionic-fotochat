import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { RoomService } from '../../services/room.service';
import { Usuario, Room } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  usuarios:Usuario[] = [];
  rooms:Room[] = [];
  buscando = false;
  valor:string = '';
  habilitado = true;

  constructor(  private usuarioService:UsuarioService,
                private roomService:RoomService ) {}

  ngOnInit() {
    this.siguientes();
  }

  buscar (e) {
    this.valor = e.detail.value;

    if (this.valor.length === 0) {
      this.buscando = false;
      this.usuarios = [];
      return;
    }

    this.buscando = true;
    this.usuarioService.buscarUsuarios(this.valor)
        .subscribe( resp => {
          console.log(resp['usuarios']);
          if ( resp['ok'] ) {
            this.usuarios = resp['usuarios'];
          } else {
            this.usuarios = [];
          }
          this.buscando = false;
    });
  }

  siguientes( event? ) {

    this.roomService.getUserRooms()
        .subscribe( res => {
          console.log(res);
          this.rooms.push( ...res.rooms );
          
          if ( event ) {
            event.target.complete();
            if (res.rooms.length === 0) {
              this.habilitado = false;
            }
          }
        });
  }

}
