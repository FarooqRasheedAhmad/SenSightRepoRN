import { AppConstants, StorageUtils } from "../utils";

export const fetchApiData = async (apiPayload) => {

    let apiResponse = { error: false, data: undefined }
    const { token, serviceUrl, method } = apiPayload
    console.log('serviceUrl ', serviceUrl)

    try {
        const res = await fetch(serviceUrl, {
                            method: method,
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                            }
                        }).then(r => {
                            if(r && r.status===500){
                                console.log("ERROR => ******** fetchApiData ********")
                                console.log(serviceUrl);
                                console.log(r);
                                console.log("END ********************");
                            }
                            return r;
                        })
                        .catch(err=>{
                            console.log("ERROR => ******** fetchApiData ********")
                            console.log(serviceUrl);
                            console.log(err);
                            console.log("END ********************");
                            return err;
                        })
        if (res) {            
            const json = await res.json();
            console.log('json ---  ', json)
            apiResponse.data = json
            apiResponse.error = false
        }
        else
        {
            console.log(res)
        }
    } catch (error) {
        apiResponse.data = undefined
        apiResponse.error = true
    }
    return apiResponse
}


/******
 * sendRequest({ 
    uri*: [http://api.com],
    method: [get || put || post],
    headers :[],
    body: []
    multipart: [boolean]
    debug [boolean]
 * })

 */
export const sendRequest = async props => {
    if (!props.uri) return {error:"Missing API URL!"};

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);

    let headers = { Accept: "application/json", Authorization: "Bearer " + token };
    if (props.method && (props.method == 'put' || props.method == 'post')) 
        headers = { 
            Accept: "application/json", "Content-Type": props.multipart ? "multipart/form-data" : "application/json", 
            Authorization: "Bearer " + token };

    const payload = {
        method: props.method || "get",
        headers: props.headers || headers,
    }
    if (props.body) Object.assign(payload, { body:props.body });

    if (props.debug) console.log("uri: ", props.uri);
    if (props.debug) console.log("payload: ", JSON.stringify(payload, 0, 2));

    const result = await fetch(props.uri, payload)
        .then((response) => {
            if (props.debug) console.log('sendRequest > response: ', response);
            if (!response.ok && response.status === 413){
                return { error: "Failed to fetch data" };
            }
            else if (!response.ok && response.status > 400 && response.status <= 500){
                return { error: `Unexpected Error : ${response.status}!` };
            }

            return response.json();
        })
        .then((json) => {
            if (!json){
                console.log("payload: ", payload);
                return {error: "No data found!"};
            }

            if (props.debug) console.log("json: ", JSON.stringify(json, 0, 2));

            if (json.error || json.errors){
                console.log("%c ****************** API ERROR!! *************** ", 'background:red;color:#fff')
                console.log(`${payload.method} : ${props.uri}`);
                console.log("payload: ", payload);
                console.log("json: ", json);
                console.log("%c ****************** ", 'background:red;color:#fff')
                return json;
            }

            return json;

        })
        .catch((error) => {
            console.log("%c ****************** API ERROR!! *************** ", 'background:red;color:#fff')
            console.log(`${payload.method} : ${props.uri}`);
            console.log("payload: ", payload);
            console.log(error);
            console.log("%c ****************** ", 'background:red;color:#fff')
        })

    return result;
}
