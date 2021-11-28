/*
    Copyrights belongs to the reapective owner
*/

const baseURL = "https://rt.data.gov.hk/v1/transport/citybus-nwfb"
var route = 13
var bound = "inbound"
var com = "NWFB"
var routeStopInfo = []
var routeStopEtaInfo = []
var orgRouteStopId = {}
var routeStopIds = []
var logs = document.getElementById("logs")
var instr = document.getElementById("instr")
document.getElementById("sellist").style.display = "none"

//document.getElementById("en1").style.animation = "txtScroll 5s linear infinite"
//getRouteInfo(com,route,bound)

function initBtn(){
    document.getElementById("routeSel").style.display = "none"
    route = document.getElementById("routeid").value
    bound = document.getElementById("bound").value
    com = document.getElementById("Company").value
    instr.innerHTML  = "Please wait..."
    document.getElementById("stopimg1").src = "Stop_" + com + ".png"
    document.getElementById("stopimg2").src = "Stop_" + com + ".png"
    document.getElementById("stopimg3").src = "Stop_" + com + ".png"
    getRouteInfo(com,route,bound)
}

function isBoundMatching(databound){
    return ((databound=="O" && bound=="outbound")||(databound=="I" && bound=="inbound"))
}

function DateToTime(datetime){
    return datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds()
}

async function getRouteInfo(com,route,bound){
    

    let fetchRes = await fetch(baseURL + "/route-stop/" + com + "/" + route + "/" + bound)
    orgRouteStopId = JSON.parse(await fetchRes.text())
    console.log(orgRouteStopId)
    for(var i in orgRouteStopId.data){
        var stopsInfo = orgRouteStopId.data[i]
        logs.innerHTML += "Loading stop " + stopsInfo.stop + ": " + i + "/" + orgRouteStopId.data.length + "<br>"
        await getStopEta(com,stopsInfo.stop,route)
        await getStop(stopsInfo.stop)
    }
    console.log(routeStopEtaInfo)
    console.log(routeStopInfo)
    for(var i in routeStopEtaInfo){
        routeStopEtaInfo[i].name_tc = routeStopInfo[routeStopEtaInfo[i].stop][0]
        routeStopEtaInfo[i].name_en = routeStopInfo[routeStopEtaInfo[i].stop][1]
    }
    
    console.log(logs)
    for(var i in routeStopEtaInfo){
        let stopText = String(routeStopEtaInfo[i].seq + "." + routeStopEtaInfo[i].eta_seq + ": " + routeStopEtaInfo[i].name_tc + " - " + DateToTime(routeStopEtaInfo[i].ETA)) + "<br>"
        console.log(stopText)
        logs.innerHTML += stopText
        document.getElementById("stopetamenu").innerHTML += "<option value='" + routeStopEtaInfo[i].seq + "." + routeStopEtaInfo[i].eta_seq + "'>" + stopText + "</option>"
    }
    document.getElementById("sellist").style.display = "block"
    instr.innerHTML = "Select the aboarding stop"
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
    let nametc = orgStopData.name_tc
    let nameen = orgStopData.name_en
    routeStopInfo[stop] = [stringProcess(nametc),stringProcess(nameen)]
    routeStopIds.push(stop)
}
function stringProcess(strname){
    let strfin = strname;
    if(strname.indexOf(",")!=-1){
        strfin = strfin.substr(0,strname.indexOf(","))
    }
    return strfin
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
    if(orgEta.length==0) {
        console.log("No matching")
        return
    };
    for(var j in orgEta.data){
        if(isBoundMatching(orgEtaData[j].dir)){
            routeStopEtaInfo.push({
                "co" : com,
                "stop" : stop,
                "eta_seq" : orgEtaData[j].eta_seq,
                "seq" : orgEtaData[j].seq,
                "ETA" : new Date(orgEtaData[j].eta)
            })
        }
        //console.log(Date.parse(orgEtaData[j].eta))
    }
    
}

function fullscreen(){
    if (document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen();
    }
    else if (document.documentElement.webkitRequestFullscreen){
      document.documentElement.webkitRequestFullscreen();
    }
    else if (document.documentElement.msRequestFullscreen){
      document.documentElement.msRequestFullscreen();
    }
}

/////////////////LOOPS / MAIN PART////////////////////
var secs = 0
var curstop_json = {}
var curstop_id


/**
 * Gets the ETA of the stop and *RETURNS* the JSON generated
 * @param {String} com The company name
 * @param {String} stop The stop ID
 * @param {String} route The Route ID
 */
 async function getStopEtaJSON(com,stop,route){
    let urlFetch = baseURL + "/eta/" + com + "/" + stop + "/" + route
    console.log(urlFetch)
    let fetchRes = await fetch(urlFetch)
    var orgEta = JSON.parse(await fetchRes.text())
    let orgEtaData = await orgEta.data
    let returnVal = {}
    //console.log(orgEta)
    if(orgEtaData.length==0) return null;
    for(var j in orgEta.data){
        if(isBoundMatching(orgEtaData[j].dir)){
            returnVal = {"co" : com,"stop" : stop,"eta_seq" : await orgEtaData[j].eta_seq,"seq" : await orgEtaData[j].seq,"ETA" : new Date(await orgEtaData[j].eta),}
            returnVal.name_en = routeStopInfo[stop][1]
            returnVal.name_tc = routeStopInfo[stop][0]
            console.log(returnVal)
            curstop_id = stop
            break
        }
        else{
            console.log("not matching")
        }
        //console.log(Date.parse(orgEtaData[j].eta))
    }
    //await setDisplay()
    console.log(returnVal)
    return returnVal
    
}



function prepareForLoop(){
    curstop_json = routeStopEtaInfo[document.getElementById("stopetamenu").selectedIndex]
    curstop_id = curstop_json.stop
    document.getElementById("sellist").style.display = "none"
    console.log("starting")
    document.getElementById("instr").style.display = "none"
    setTxtDisplay()
    stopSelect()
}

function stopSelect(){
    secs++
    console.log(curstop_json)
    
    let h = new Date().getHours()
    let m = new Date().getMinutes()
    let s = new Date().getSeconds()
    let milsecs = new Date().getTime()
    //Compare time for now and ETA
    if(secs%60==0){
        let pmise = getStopEtaJSON(com,curstop_id,route)
        pmise.then(function(value){
            curstop_json = value
            setTxtDisplay()
        })
        
    }
    console.log((new Date(curstop_json.ETA).getTime() - milsecs))
    let timeleft = (new Date(curstop_json.ETA).getTime() - milsecs)
    if(timeleft<0){
        let pmise = getStopEtaJSON(com,routeStopIds[routeStopIds.indexOf(curstop_id)+1],route)
        pmise.then(function(value){
            curstop_json = value
            setTxtDisplay()
        })
    }
    
    //setTxtDisplay()
    setImgDisplay(timeleft,(new Date(curstop_json.ETA).getMinutes()))
    setTimeout(stopSelect,1000)


}

function setTextSize(text,isEn){
    if(!isEn){
        if(text.length >= 8){
            if(text.length >= 11){
                return (text.length/5) + "vw"
            }
            else{
                return (text.length/2) + "vw"
            }
            
        }
    }
    else{
        console.log(text.length)
        if(text.length >= 17){
            return (text.length/5) + "vw"
        }
    }
}

async function setTxtDisplay(){
    if(curstop_json!=undefined){
        //console.log(curstop_json.stop)
        //console.log(routeStopInfo)
        var txtDisplay = []
        var txtDisplayEn = []
        txtDisplay.push(document.getElementById("tc1"))
        txtDisplayEn.push(document.getElementById("en1"))
        txtDisplay.push(document.getElementById("tc2"))
        txtDisplayEn.push(document.getElementById("en2"))
        txtDisplay.push(document.getElementById("tc3"))
        txtDisplayEn.push(document.getElementById("en3"))

        document.getElementById("tc1").innerHTML = routeStopInfo[curstop_json.stop][0]
        document.getElementById("en1").innerHTML = routeStopInfo[curstop_json.stop][1]
        document.getElementById("tc2").innerHTML = routeStopInfo[routeStopIds[routeStopIds.indexOf(curstop_json.stop)+1]][0]
        document.getElementById("en2").innerHTML = routeStopInfo[routeStopIds[routeStopIds.indexOf(curstop_json.stop)+1]][1]
        document.getElementById("tc3").innerHTML = routeStopInfo[routeStopIds[routeStopIds.indexOf(curstop_json.stop)+2]][0]
        document.getElementById("en3").innerHTML = routeStopInfo[routeStopIds[routeStopIds.indexOf(curstop_json.stop)+2]][1]

        /*
        for(let i in txtDisplay){ // TODO seperate top and bottom text && MAke it into a new function
            if(txtDisplay[i].innerHTML.length>=8){
                txtDisplay[i].style.animationName = "txtScroll"
                txtDisplay[i].style.animationDuration = txtDisplay[i].innerHTML.length/1.5 + "s"
                txtDisplay[i].style.animationTimingFunction = "linear"
                txtDisplay[i].style.animationIterationCount = "infinite"
            }
            else{
                txtDisplay[i].style.animationName = ""
            }
        }
        for(let i in txtDisplayEn){ // TODO seperate top and bottom text
            let totUpper = txtDisplayEn[i].innerHTML.length - txtDisplayEn[i].innerHTML.replace(/[A-Z]/g, '').length;
            let totLower = txtDisplayEn[i].innerHTML.length - totUpper
            let tot = ((totLower/2)+totUpper)
            console.log(tot)
            if(tot>=13){
                txtDisplayEn[i].style.animationName = "txtScroll"
                txtDisplayEn[i].style.animationDuration = txtDisplayEn[i].innerHTML.length/2 + "s"
                txtDisplayEn[i].style.animationTimingFunction = "linear"
                txtDisplayEn[i].style.animationIterationCount = "infinite"
            }
            else{
                txtDisplayEn[i].style.animationName = ""
            }
            console.log(txtDisplayEn[0])
        }
        */
        if(document.getElementById("tc1").innerHTML.length>=8){
            document.getElementById("tc1").style.animationName = "txtScroll"
            document.getElementById("tc1").style.animationDuration = document.getElementById("tc1").innerHTML.length/1.5 + "s"
            document.getElementById("tc1").style.animationTimingFunction = "linear"
            document.getElementById("tc1").style.animationIterationCount = "infinite"
        }
        else{
            document.getElementById("tc1").style.animationName = ""
        }

        let totUpper = document.getElementById("en1").innerHTML.length - document.getElementById("en1").innerHTML.replace(/[A-Z]/g, '').length;
        let totLower = document.getElementById("en1").innerHTML.length - totUpper
        let tot = ((totLower/2)+totUpper)
        console.log(tot)
        if(tot>=13){
            document.getElementById("en1").style.animationName = "txtScroll"
            document.getElementById("en1").style.animationDuration = document.getElementById("en1").innerHTML.length/2.5 + "s"
            document.getElementById("en1").style.animationTimingFunction = "linear"
            document.getElementById("en1").style.animationIterationCount = "infinite"
        }
        else{
            document.getElementById("en1").style.animationName = ""
        }
        console.log(txtDisplayEn[0])
    }
    
}

function setImgDisplay(tLeft, etamin, light){
    let stopimg = document.getElementById("stopimg1")
    if(etamin==new Date().getMinutes){
        if(com=="CTB"){
            if(stopimg.getAttribute("src")=="Stop_CTB_arr.png"){
                stopimg.src = "Stop_CTB_arr2.png"
            }
            else{
                stopimg.src = "Stop_CTB_arr.png"
            }
        }
        else if(com=="NWFB"){
            if(stopimg.getAttribute("src")=="Stop_NWFB_arr.png"){
                stopimg.src = "Stop_NWFB_arr2.png"
            }
            else{
                stopimg.src = "Stop_NWFB_arr.png"
            }
        }
    }
    else{
        //console.log("Not Same")
        if(com=="CTB"){
            //console.log(stopimg.src)
            if(stopimg.getAttribute("src")=="Stop_CTB.png"){
                stopimg.src = "Stop_CTB_light.png"
            }
            else{
                stopimg.src = "Stop_CTB.png"
            }
        }
        else if(com=="NWFB"){
            if(stopimg.getAttribute("src")=="Stop_NWFB.png"){
                stopimg.src = "Stop_NWFB_light.png"
            }
            else{
                stopimg.src = "Stop_NWFB.png"
            }
        }
    }
}