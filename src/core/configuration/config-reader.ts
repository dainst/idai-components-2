import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {MDInternal} from '../messages/md-internal';

@Injectable()
/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export class ConfigReader {

    constructor(private http: Http) {}


    public read(path: string): Promise<any> {

        return new Promise((resolve, reject) => {

            this.http.get(path).subscribe((data_: any) => {

                let data;
                try {
                    data = JSON.parse(data_['_body']);
                } catch(e) {
                    reject([MDInternal.PARSE_ERROR_INVALID_JSON, path]);
                }

                try {
                    resolve(data);
                } catch(e) {
                    console.log(e);
                }
            });
        });
    }
}