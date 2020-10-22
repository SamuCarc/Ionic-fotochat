import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RespuestaRooms, RespuestaRoom } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  paginaRoom = 0;
  
  constructor(  private http:HttpClient,
                private usuarioService:UsuarioService ) { }

  // Obtener salas de este usuario
  getUserRooms() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    this.paginaRoom ++;
    return this.http.post<RespuestaRooms>(`${ URL }/room`, {pagina:this.paginaRoom},{headers});
  }

  // Obtenemos sala por ID
  getRoomById (roomID:string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise( resolve => {      
      this.http.post(`${ URL }/room/roomById`, {roomID}, {headers})
          .subscribe( res => {
            resolve(res);
          }, err => {
            resolve(err.error);
          });
    });

  }

  // Creamos una sala de dos usuarios
  createSingleRoom (userID:string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise( resolve => {      
      this.http.post(`${ URL }/room/singleRoom`, {userID}, {headers})
          .subscribe( res => {
            resolve(res);
          }, err => {
            resolve(err.error);
          });
    });
  }
}
