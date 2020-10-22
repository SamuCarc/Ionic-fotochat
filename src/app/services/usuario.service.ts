import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Usuario, UsuarioFormateado, UsuarioRegistro } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token:string = null;
  private usuario:Usuario = {};

  constructor( private http: HttpClient,
                private storage: Storage,
                private navCtrl:NavController ) { }
                
  
  login( email: string, password: string ) {

    const data = { email, password };

    return new Promise( resolve =>  {
      this.http.post(`${ URL }/user/login`, data)
          .subscribe( async res => {
  
            if(res['ok']) {
              await this.guardarToken( res['token'] );
              resolve(true);
            } else {
              this.token = null;
              this.storage.clear();
              resolve(false);
            }
          }, err => {
            this.token = null;
            this.storage.clear();
            resolve(false);
          })
    });
  }

  logout () {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated:true });
  }


  registro( usuario:UsuarioRegistro ) {

    const usuarioFormateado:UsuarioFormateado = {
      nombres: usuario.nombre.nombres,
      apellidos: usuario.nombre.apellidos,
      password: usuario.password,
      email: usuario.email,
      avatar: usuario.avatar,
    };

    return new Promise( resolve => {
      this.http.post(`${ URL }/user/create`, usuarioFormateado)
          .subscribe( async res => {

            if (res['ok']) {
              await this.guardarToken( res['token'] );
              resolve(res);
            } else {
              this.token = null;
              this.storage.clear();
              resolve(res);
            }
          }, err => {
            this.token = null;
            this.storage.clear();
            resolve(err.error);
          });
    });

  }


  getUsuario() {
    if (this.usuario._id) {
      this.validaToken();
    }

    return { ...this.usuario };
  }


  async guardarToken ( token:string ) {
    this.token = token;
    await this.storage.set('token', token);

    await this.validaToken();
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  async validaToken (): Promise<boolean> {

    await this.cargarToken();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.http.get(`${ URL }/user/`, {headers})
                .subscribe( res => {
                  if (res['ok']) {
                    this.usuario = res['usuario'];
                    resolve(true);
                  } else {
                    this.navCtrl.navigateRoot('/login');
                    resolve(false);
                  }
                }, err => {
                  this.navCtrl.navigateRoot('/login');
                  resolve(err.eror);
                });
    });

  }


  actualizarUsuario( usuario:UsuarioRegistro ) {
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    const usuarioFormateado:UsuarioFormateado = {
      nombres: usuario.nombre.nombres,
      apellidos: usuario.nombre.apellidos,
      password: usuario.password,
      email: usuario.email,
      avatar: usuario.avatar,
    };
    
    return new Promise( resolve => {
      this.http.post(`${ URL }/user/update`, usuarioFormateado, { headers })
          .subscribe( res =>{
  
            if (res['ok']) {
              this.guardarToken( res['token'] );
              resolve(res);
            } else {
              resolve(res);
            }
  
          }, err => {
            resolve(err.error);
          });
    });
  }


  buscarUsuarios( string:string, ) {
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return this.http.post(`${ URL }/user/getUsers`, {string, pagina:1} , { headers });
  }

}
