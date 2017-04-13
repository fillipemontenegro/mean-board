import { Routes, RouterModule } from "@angular/router";

import { SignupComponent } from "./signup.component";
import { SigninComponent } from "./signin.component";
import { SignoutComponent } from "./signout.component";

const AUTH_ROUTES: Routes = [
  { path: "", redirectTo: "signup", pathMatch: "full" },
  { path: "signup", component: SignupComponent },
  { path: "signin", component: SigninComponent },
  { path: "signout", component: SignoutComponent }
];

export const authRouting = RouterModule.forChild(AUTH_ROUTES);
