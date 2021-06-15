//app1 but with csv writing added

const fetch = require('node-fetch');

//fetch list of all influencers who meet our criteria
async function fetch1() {
    try {
        const response = await fetch("https://api.tokfluence.com/platform-users/search-influencers-v2", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-GB,en;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json;charset=UTF-8",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sessionid": "d71e3b7d-80a0-4126-b8d7-2aa47b29567e"
                },
                "referrer": "https://app.tokfluence.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"tiktokRegions\":[\"US\",\"GB\",\"CA\",\"AU\",\"ES\",\"MX\",\"BR\",\"CO\",\"DE\"],\"tiktokFollowerCount\":{\"gte\":200000},\"skip\":100,\"limit\":100,\"hasContactEmail\":true,\"sort\":\"tiktokFollowerCount\",\"sortOrder\":\"desc\"}",
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
                })
                .then(response => response.json());
              
                //convert result of fetch into a json file and return it
                return response;

        } catch {
            console.log("error");
        }
}

//fetch info on each user
async function fetch2(iduser) {
    try{
        //concat id of user fed into function with prefix so it forms a valid json attribute
        var newuser = "{\"userId\":\""
        newuser = newuser.concat(iduser,"\"}");
        const response = await fetch("https://api.tokfluence.com/platform-users/get-user-by-id", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-GB,en;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/json;charset=UTF-8",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sessionid": "d71e3b7d-80a0-4126-b8d7-2aa47b29567e"
                },
                "referrer": "https://app.tokfluence.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": newuser,
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
                }).then(response => response.json());
    
                var txt = JSON.stringify(response);
                
                var txt = txt.slice(1,txt.length);
    
                return txt;
        
        //slice off opening bracket of returned JSON
    
    } catch {
        console.log("error");
    }
}


async function processFetches() {
try{
//array to store concatenated fetch1 and fetch2 request of all users
allinfluencerdetails = []
//store details of all users from first fetch
const fetch1response = await fetch1();
var numresponses = fetch1response.length;

for (var x = 0; x<1; x++) {
    //store details of all users from second fetch
    const fetch2item = await fetch2(fetch1response[x]._id);
    var fetch1item = JSON.stringify(fetch1response[x]);
    //strip closing bracket of fetch1 request off
    var fetch1itemsliced = fetch1item.slice(0,fetch1item.length-1);
    //concatenate this with fetch 2 request, of which we have already sliced off the opening bracket
    var response = fetch1itemsliced.concat(",",fetch2item);
    //when concatenated forms one json item containing data from both fetch1 and fetch2 request for each user
    //add this to array of details of all influencers
    allinfluencerdetails = allinfluencerdetails.concat(response);
    //so you can track progress as request is carried out in terminal
    console.log(x+1 + " out of " + numresponses + " responses done")
}
//console.log(allresponses);
console.log("Process finished");
//logToCSV(allresponses)
} catch{ console.log("error"); }
}

//function which takes array of JSON containing all of our influencer data
async function logToCSV(responses) { 
    //create json -> csv converter objects
    const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
    //setup converter object so we capture the data we want from the json data to our csv file for each influencer
    const csvStringifier = createCsvStringifier({
        header: [
            {id: 'username', title: 'tiktok_username'},
            {id: 'followerCount', title: 'tiktok_followercount'},
            {id: 'verified', title: 'tiktok_verified'},
            {id: 'instagramUsername', title: 'instagram_username'},
            {id: 'region', title: 'region'},
            {id: 'profilePicEstimatedAge', title: 'age_estimation'},
        ]
    });
   
    //log some of this data, useful for testing

    console.log(csvStringifier.getHeaderString());
    // => 'NAME,LANGUAGE\n'
     
    console.log(csvStringifier.stringifyRecords(responses));
}

processFetches();