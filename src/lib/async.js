const TimeUnit = {
    ms: 1,
    msec: 1,
    millisecond: 1,
    milliseconds: 1,
    milis: 1,
    sec: 1000,
    second: 1000,
    seconds: 1000,
    s: 1000,
    hr: 3600000,
    hour: 3600000,
    h: 3600000,
    hours: 3600000,
    hrs: 3600000,
    min: 60000,
    minute: 60000,
    minutes: 60000,
    m: 60000
}

const delay = (u, unit = TimeUnit.msec) => new Promise(resolve => setTimeout(resolve, (u * unit)));
const getjson = (url, query, callback) => fetch(url + "?" + (new URLSearchParams(query)).toString()).then(data => {data.json()}).then(data => {callback(data)}).catch(error => {throw new Error(error)});
