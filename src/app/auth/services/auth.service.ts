import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  constructor(private http: HttpClient) { }

  //Servicio que me permite hacer el login con mi backend
  login( email: string, password: string){
    
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        // el operador tap() obliga a que se ejecute primero el código que este dentro antes de siga la ejecucción 
        // de los demas operadores
        tap( resp => {
          if(resp.ok){
            localStorage.setItem('token', resp.token!)
            this._usuario = {
              name: resp.name!,
              uid: resp.uid!
            }
          }
        }),
        // !importante el orden de los operadores de rxjs es muy imporatnte ya que se ejecutan de esa forma
        //Map es un operador de rxjs que me permite mutar la respuesta acondicionandola a lo que se requiere
        map( resp => resp.ok),
        //el operador cathError me permite atrapar un error y con la funcion of() me permite
        //convertir la respuesta en un observable
        catchError( err => of(err.error.msg))
      )
  }

  validarToken() {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')

      // los headers como objeto me permite generar los token que se necesiten
    this.http.get(url, {headers});
  }
}
