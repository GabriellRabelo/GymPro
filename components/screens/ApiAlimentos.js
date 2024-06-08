/*import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const consumerKey = '483e0c1710f949f2b706ad016067cc0c';
const consumerSecret = '4bef190cd8fa460ea58459a1b91beaa5';

const oauth = OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
});

const request_data = {
    url: 'https://platform.fatsecret.com/rest/server.api',
    method: 'POST',
};

const token = {
    key: '',
    secret: '',
};

export const searchFood = async (query) => {
    const params = {
        method: 'foods.search',
        format: 'json',
        search_expression: query,
    };

    const authHeader = oauth.toHeader(oauth.authorize({ ...request_data, data: params }, token));

    try {
        const response = await axios.post(request_data.url, null, {
            params,
            headers: {
                ...authHeader,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar alimentos:', error);
        throw error;
    }
};*/
