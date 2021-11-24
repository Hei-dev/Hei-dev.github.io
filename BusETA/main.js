const baseURL = "https://rt.data.gov.hk/v1/transport/citybus-nwfb"
var route = 6
var bound = "inbound"
var com = "CTB"
var routeStopInfo = []
var routeStopEtaInfo = []
getRouteInfo(com,route,bound)

function isBoundMatching(databound){
    return ((databound=="O" && bound=="outbound")||(databound=="I" && bound=="inbound"))
}

function DateToTime(datetime){
    return Date(datetime).getHours() + ":" + Date(datetime).getMinutes() + ":" + Data(datetime).getSeconds()
}

async function getRouteInfo(com,route,bound){
    let fetchRes = await fetch(baseURL + "/route-stop/" + com + "/" + route + "/" + bound)
    var orgRouteStopId = JSON.parse(await fetchRes.text())
    console.log(orgRouteStopId)
    for(var i in orgRouteStopId.data){
        var stopsInfo = orgRouteStopId.data[i]
        //console.log(stopsInfo.stop)
        await getStopEta(com,stopsInfo.stop,route)
        await getStop(stopsInfo.stop)
    }
    console.log(routeStopEtaInfo)
    console.log(routeStopInfo)
    for(var i in routeStopEtaInfo){
        routeStopEtaInfo[i].name_tc = routeStopInfo[routeStopEtaInfo[i].stop][0]
        routeStopEtaInfo[i].name_en = routeStopInfo[routeStopEtaInfo[i].stop][1]
    }
    var logs = document.getElementById("logs")
    console.log(logs)
    for(var i in routeStopEtaInfo){
        console.log(routeStopEtaInfo[i].seq + "." + routeStopEtaInfo[i].eta_seq + ": " + routeStopEtaInfo[i].name_tc + " - " + routeStopEtaInfo[i].ETA.toString())
        logs.innerHTML += String(routeStopEtaInfo[i].seq + "." + routeStopEtaInfo[i].eta_seq + ": " + routeStopEtaInfo[i].name_tc + " - " + routeStopEtaInfo[i].ETA.toString()) + "<br>"
    }
    //console.log(logs)
}

/**
 * Gets the stop information and *STORES* the JSON data into the array `routeStopInfo`
 * @param {String} stop the stop ID
 *
 */
async function getStop(stop){
    let fetchRes = await fetch(baseURL + "/stop/" + stop)
    var orgStopList = JSON.parse(await fetchRes.text())
    let orgStopData = orgStopList.data;
    routeStopInfo[stop] = [orgStopData.name_tc,orgStopData.name_en]
}

/**
 * Gets the ETA of the stop and *STORE* it to the array `routeStopEtaInfo`
 * @param {String} com The company name
 * @param {String} stop The stop ID
 * @param {String} route The Route ID
 */
async function getStopEta(com,stop,route){
    let fetchRes = await fetch(baseURL + "/eta/" + com + "/" + stop + "/" + route)
    var orgEta = JSON.parse(await fetchRes.text())
    let orgEtaData = orgEta.data
    //console.log(orgEta)
    if(orgEta.length==0) return;
    for(var j in orgEta.data){
        if(isBoundMatching(orgEtaData[j].dir)){
            routeStopEtaInfo.push({
                "stop" : stop,
                "eta_seq" : orgEtaData[j].eta_seq,
                "seq" : orgEtaData[j].seq,
                "ETA" : new Date(orgEtaData[j].eta)
            })
        }
        //console.log(Date.parse(orgEtaData[j].eta))
    }
    
}