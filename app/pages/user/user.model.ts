export class User {
    constructor(
        public id: number,
        public name: string,
        public last_name: string,
        public email: string,
        public provider: string,
        public provider_id: string,
        public provider_pic: string,
        public date_last_visit: Date,
        public access: number,
        private _token: string,
        private _tokenExpirationDate: Date
    ) { }

    get token() {
        // if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        //     return null;
        // }
        return this._token;
    }
}