import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
  selector: 'app-signout',
  template: `
    <div class="col-md-8 col-md-offset-2">
      <button class="btn btn-danger" (click)="onLogout()">Logout</button>
    </div>
  `
})

export class SignoutComponent {

  constructor (private authService: AuthService, private router: Router) {}
  onLogout() {
    this.authService.signout();
    this.router.navigate(['/auth', 'signin']);
  }
}
