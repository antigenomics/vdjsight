export namespace AuthForms {

  export interface LoginForm {
    readonly email: string;
    readonly password: string;
  }

  export interface SignupForm {
    readonly email: string;
    readonly login: string;
    readonly password1: string;
    readonly password2: string;
  }

  export interface ResetForm {
    readonly email: string;
  }

  export interface ChangeForm {
    readonly password1: string;
    readonly password2: string;
  }

}
