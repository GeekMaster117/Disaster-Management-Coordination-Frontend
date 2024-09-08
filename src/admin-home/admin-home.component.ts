import { Component, OnInit } from "@angular/core";
import { AuthGuard } from "../guard/auth.guard";
import { Router } from "@angular/router";

@Component({
    selector: 'adminhome',
    templateUrl: './admin-home.component.html',
    styleUrl: './admin-home.component.css'
})

export class AdminHomeComponent implements OnInit {
    public constructor(private router: Router, private guard: AuthGuard) { }

    public ngOnInit(): void {
        setTimeout(() => {
            if (!this.guard.isLoggedIn())
            {
                alert('Login Expired. Please login again')
                this.router.navigate(['login'])
            }
        }, 10)
    }
}