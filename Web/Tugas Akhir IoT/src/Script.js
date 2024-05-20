import axios from "axios";

async function GetData(channel_id, api_key, field_num, num_data = 50)
{
    const request_http = `https://api.thingspeak.com/channels/${channel_id}/fields/${field_num}.json?api_key=${api_key}&results=${num_data}`
    const result = await axios.get(request_http)
    return result
} 

async function SendData(channel_id, api_key, field_data_pair)
{
    if(field_data_pair.length == 0) return;

    let res = {
        data: 0
    }
    let retry_counter = 0
    let base_http = `https://api.thingspeak.com/update?api_key=${api_key}`

    for(let i = 0; i < field_data_pair.length; i++){
        base_http += `&field${i+1}=${field_data_pair[i].value}`
    }

    while(res.data == 0){
        if(retry_counter > 9) break;

        res = await axios.get(base_http);

        retry_counter++;
    }

    return res.data;
}

async function GetAllData(channel_id, api_key, field_num)
{
    const request_http = `https://api.thingspeak.com/channels/${channel_id}/fields/${field_num}.json?api_key=${api_key}&results=99999999`
    const result = await axios.get(request_http)
    return result
}

async function GetDataValue(channel_id, api_key, field_num)
{
    const result = await GetData(channel_id, api_key, field_num)
    const data = result.data.feeds
    const data_length = result.data.feeds.length

    let data_buffer = []

    for(let i = 0; i < data_length; i++){
        data_buffer.push(parseFloat(data[i][`field${field_num}`]))
    }

    // console.log(data_buffer)
    return data_buffer
}

async function getDataFeeds(channel_id, api_key, field_num, num_data)
{
    const raw_data = await GetData(channel_id, api_key, field_num, num_data)
    const feeds = raw_data.data.feeds

    return feeds
}

function getAverage(data)
{
    let sum = 0

    data.forEach(element => {
        sum += parseFloat(element)
    });

    return sum / data.length
}


// function getMax(data)
// {
//     let max_val =   
// }

export {
    GetData,
    GetDataValue, 
    getAverage,
    getDataFeeds,
    SendData
}