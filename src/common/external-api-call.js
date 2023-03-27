import axios from 'axios'


export const fetchData = async (url, token = null) => {
    try {
        if (token == null) {
            let result;
            const response = await axios.get(url);
            if (response.status == 200 && response.data) {
                return result = response.data;
            }else{
                return null;
            }
        }else{
            const headers = {
                Authorization: `Bearer ${token}`
            };
            let result;
            const response = await axios.get(url, {headers: headers});
            if (response.status == 200 && response.data) {
                return result = response.data;
            }else{
                return null;
            }

        }
       
    } catch (error) {
        return null;
    }
}