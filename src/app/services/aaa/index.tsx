import Cookies from 'cookies-js';

export default class AAA {
    private static instance: AAA;
    private hasUserCookie: boolean;
    private nss: string;
    private nsk: string;
    private account: any;
    private isAthenticated: boolean = false;


    static getInstance() {
        if (!this.instance) {
            this.instance = new AAA();
        }

        return this.instance;
    }

    getCredentials() {
        return {
            ss: this.nss,
            sk: this.nsk
        };
    }

    setCredentials(credential: any) {
        Cookies.set('nss', credential._ss);
        Cookies.set('nsk', credential._sk);
        this.nss = credential._ss;
        this.nsk = credential._sk;
        this.hasUserCookie = this.checkUserCookie();
    }

    setUser(account: any): void {
        this.account = account;
        this.isAthenticated = true;
        console.log(account, this);
    }

    getUser(): any {
        return this.account;
    }

    setIsUnAthenticated(): void {
        this.isAthenticated = false;
        this.nss = null;
        this.nsk = null;
        Cookies.set('nss');
        Cookies.set('nsk');
        this.account = null;
    }

    hasUser(): Promise<boolean> {
        return new Promise((res) => {
            if (this.checkUserCookie()) {
                res(false);
            } else {
                res(false);
            }
        });
    }


    private constructor() {
        this.hasUserCookie = this.checkUserCookie();
        this.nss = Cookies.get('nss');
        this.nsk = Cookies.get('nsk');
    }

    private checkUserCookie(): boolean {
        let nss = Cookies.get('nss');
        let nsk = Cookies.get('nsk');
        return (nss && nsk);
    };

}
