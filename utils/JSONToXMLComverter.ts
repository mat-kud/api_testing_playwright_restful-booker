export function parseBookingJSONToXML(json) : string {
    return `<?xml version="1.0" encoding="UTF-8" ?><booking>${parseBody(json)}</booking>`;
}

function parseBody(json) : string {
    let xml = '';

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            if (typeof json[key] == 'object') {
                xml += `<${key}>${parseBody(json[key])}</${key}>`;
            } else {
                xml += `<${key}>${json[key]}</${key}>`;
            }
        }
    }

    return xml;
}