import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  /*Para el mnanejo de formularios reactivos es importante primero hacer la importacion
  en el module de ReactiveFormModules
  
  **El uso del FormGroup me permiet hacer validaciones y la  variable miFormulario debe ser 
  inyectada en nuestro html
  
  ** se debe inyectar el formBuilder en el constructor para hacer el suo del servicio*/

  miFormulario: FormGroup = this.fb.group({
    email: ['test1@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  })

  constructor(  private fb: FormBuilder,
                private authService: AuthService) { }

  login(){
    console.log(this.miFormulario.value);
    
    const { email, password } = this.miFormulario.value

    this.authService.login( email, password )
      .subscribe(resp => {
        console.log(resp)
      })
  }

  

}
