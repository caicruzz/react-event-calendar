import axios from 'axios';

class DataService {

    static get(url, params = null) {
        const defaultConfig = { headers: { 'content-type': 'application/json' } }
        const config = params === null ? defaultConfig: { headers: defaultConfig.headers, params }

        return axios.get(url, config)
            .then(result => result.data,
                error => error);
    }

    static post(url, data) {
        return axios.post(url, data).then(result => result.data);
    }
}

export default DataService;
