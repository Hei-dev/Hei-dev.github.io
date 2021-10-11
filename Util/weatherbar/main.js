var wea; 
var swt;
var init = false;
var sec = 0;
var ws = 0;
var swts = 0;
var lim = 1;
var wsig;
var detime = 1;
var delim = 0;
var tcsig = "";
//document.getElementById("weather").classList.add('notransition');

var getIc = function(num){
  if(num == 50){
    return "☀️";
  }
  else if(num == 51){
    return "🌤";
  }
  else if(num == 52){
    return "⛅"
  }
  else if(num == 53){
    return "🌦";
  }
  else if(num == 54){
    return "🌦"
  }
  else if(num == 60){
    return "☁";
  }
  else if(num == 61){
    return "☁"
  }
  else if(num == 62){
    return "🌧";
  }
  else if(num == 63){
    return "🌧"
  }
  else if(num == 64){
    return "🌧";
  }
  else if(num == 65){
    return "⛈";
  }
  else if(num == 70){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic70.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic71.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic72.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic73.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic74.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic75.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic76.png' style='width:50px; height:50px'/>"
  }
  else if(num == 71){
    return "<img src='https://www.hko.gov.hk/images/HKOWxIconOutline/pic77.png' style='width:50px; height:50px'/>"
  }
  else if(num == 80){
    return "🌪";
  }
  else if(num == 90){
    return "🌡"
  }
  else if(num == 91){
    return "🌡";
  }
  else if(num == 92){
    return "⛄"
  }
  else if(num == 93){
    return "⛄";
  }
  else if(num == 83){
    return "🌫";
  }
  else if(num == 84){
    return "🌫";
  }
  else{
    return num;
  }
}

var warnsign = function(sign){
  if(sign=="WTS"){
    return "⚡";
  }
  else if(sign=="WMSGNL"){
    return "<img src='https://www.hko.gov.hk/tc/wxinfo/dailywx/images/msn.gif' style='width:50px; height:50px'/>";
  }
  else if(sign=="WHOT"){
    return "<span style=\"color:red\">🌡H</span>";
  }
  else if(sign=="WCOLD"){
    return "<span style=\"color:blue\">🌡C</span>";
  }
  else if(sign=="WTMW"){
    return "🌊";
  }
  else if(sign=="WRAINA"){
    return "<span style=\"color:yellow\">🌧A</span>";
  }
  else if(sign=="WRAINR"){
    return "<span style=\"color:red\">🌧R</span>";
  }
  else if(sign=="WRAINB"){
    return "<span style=\"color:gray\">🌧B</span>";
  }
  else if(sign=="WFIRER"){
    return "<span style=\"color:red\">🔥R</span>";
  }
  else if(sign=="WFIREY"){
    return "<span style=\"color:yellow\">🔥Y</span>";
  }
  else if(sign=="TC1"){
    return "<span style=\"font-weight:1000;\">T1</span>1";
  }
  else if(sign=="TC3"){
    return "<span style=\"font-weight:3000;\">⊥3</span>3";
  }
  else if(sign=="TC8NE"){
    return "<img src='TyphoonSignal/8NE_white.png' style='height:50px;'/>8-NE";
  }
  else if(sign=="TC8SE"){
    return "<img src='TyphoonSignal/8SE_white.png' style='height:50px;'/>8-SE";
  }
  else if(sign=="TC8SW"){
    return "▼8-SW";
  }
  else if(sign=="TC8NW"){
    return "▲8-NW";
  }
  else if(sign=="TC9"){
    return "<img src='TyphoonSignal/9_white.png' style='height:50px;'/>9";
  }
  else if(sign=="TC10"){
    return "+10";
  }
  else{
    return "";
  }
}

var hasSubtype = function(c){
  return (c=="WFIRE")||(c=="WTCSGNL")||(c=="WRAIN");
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var hms;
  m = checkTime(m);
  s = checkTime(s);
  //document.getElementById('txt').innerHTML =
  //h + ":" + m + ":" + s;
  hms = h + ":" + m + ":" + s;
  sec = sec + 1;
  
  

  var t = setTimeout(startTime, 1000);

  if((sec%600)==0 || !init){
    
    //console.log(init);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           wea = JSON.parse(xhttp.responseText);
           document.getElementById("weather").innerHTML = "updating";
        }
    };
    xhttp.open("GET", "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en", true);
    xhttp.send();
    
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
          swt = JSON.parse(xhttp2.responseText);
          //局部地區大雨報告：屯門區在下午 5 時正的過去一小時 錄得超過 70 毫米雨量，有可能出現嚴重水浸。
          //debug 香港天文台宣布預計在今天（9 月 24 日）下午 4 時 07 分或以前發出八號熱帶氣旋警告信號，本港風勢將會加強。政府提醒返家路 程偏遠、轉折或居住離島的市民，現應啟程回家。政府已通知屬下此類員工 下班。教育局宣布：所有日校今日停課。假如夜校需要停課，該局會於稍後 公布。
          //swt = { "swt": [{ "desc": "", "updateTime": "2020-09-24T14:10:00+08:00" }, { "desc": "", "updateTime": "2020-09-10T16:40:00+08:00" } ] };
          document.getElementById("weather").innerHTML = "updating";
          ////console.log(swt.swt);
          ////console.log(Object.keys(swt.swt).length);
          if(Object.keys(swt.swt).length > 0){
            lim = 3;
          }
          else{
            lim = 2;
          }
          
          //console.log("lim" + lim);
        }
    };
    xhttp2.open("GET", "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt&lang=tc", true);
    xhttp2.send();

    //console.log(swt.desc==null);

    var xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
          //wsig = JSON.parse(xhttp3.responseText);
          //debug
          //wsig = { "details": [{ "contents": ["天文台在上午 11 時 15 分發出紅色暴雨警告信號。 "], "subtype": "TC9", "warningStatementCode": "WRAIN", "updateTime": "2020-09-24T11:15:00+08:00" },{ "contents": ["雷暴警告", "天文台在 9 月 24 日上午 11 時 40 分發 出之雷暴警告，有效時間延長至今日下午 7 時 30 分，預料香港有雷暴。", " 雷暴發生時，請採取以下預防措施：", "1. 留在室內。在室外的人士應躲入建 築物內。", "2. 切勿站立於高地或接近導電的物體、樹木或桅杆。"], "warningStatementCode": "WTS", "updateTime": "2020-09-24T05:00:00+08:00" }, { "contents": ["強烈季候風信號在 11 時 15 分發出。"], "warningStatementCode": "WCOLD", "updateTime": "2020-09-24T11:15:00+08:00" }, { "contents": ["山泥傾瀉警告：\n\n 天文台在 11:15 發出山泥傾瀉 警告。"], "warningStatementCode": "WL", "updateTime": "2020-09-24T11:15:00+08:00" } ] };
          document.getElementById("weather").innerHTML = "updating";
          
          ////console.log(weather.details)
          
          //console.log("sfd " + wsig.details[1].subtype);
        }
    };
    xhttp3.open("GET", "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warninginfo&lang=tc", true);
    xhttp3.send();

    init = true;
    
    
  }

  if(delim>0){
    detime++;
  }
  
  if((sec%7==0)&&(detime>delim)){
    ws = ws + 1;
    detime = 1;
    delim = 0;
    //document.getElementById("weather").style.AnimationPlayState = "0";
    //console.log(document.getElementById("weather").style.animationPlayState);
    if(ws>lim){
      ws = 0;
    }
    if(!ws==2 || !ws==3){
      document.getElementById("weather").style.animationPlayState = "paused";
    }
  }

  ////console.log(wea.temperature.data[8].place);
  document.getElementById("weather").style.animation = "";
  document.getElementById("weather").style.visibility = "visible";
  document.getElementById("wsc").style.visibility = "hidden";

  //console.log(lim)

  if(ws==0){
    var weat = "";
    if(wea.icon.length > 1){
      weat = (wea.temperature.data[8].value) + "°C  " + getIc(wea.icon[0]) + "➡" + getIc(wea.icon[1]);
    }
    else{
      weat = (wea.temperature.data[8].value) + "°C  " + getIc(wea.icon);
    }
    var stxt = "";
    var objts;
    var styp = "";
    
    //try{
      for(objts in wsig.details){
        //console.log(objts)
        //console.log(wsig.details[objts]);
        if(hasSubtype(wsig.details[objts].warningStatementCode)){
          styp = wsig.details[objts].subtype;
          //console.log(wsig.details[objts].warningStatementCode)
		      if(wsig.details[objts].warningStatementCode=="WTCSGNL"){
            //console.log(wsig.details[objts].contents)
			      tcsig = String(wsig.details[objts].contents).replace(/,/g,"")
			      lim = 3
		      }
        }
        else{
          styp = wsig.details[objts].warningStatementCode;
        }
        weat = weat + " " + warnsign(styp);
        //console.log(stxt);
      }
    //}
    //catch(e){

    //}
    document.getElementById("weather").innerHTML = weat;
  }
  else if(ws==1||ws==2){
    document.getElementById("weather").innerHTML = hms;
  }
  else if(ws==2){
    document.getElementById("weather").style.animation = "scrolls 7s 1 linear";
    document.getElementById("weather").innerHTML = "";
  }
  else if(ws==3){
    //console.log(document.getElementById("weather").style.animationPlayState);
    
    var wtxt = "";
    var objt;
    for(objt in swt.swt){
	var objti = Number(objt) + 1
      wtxt = wtxt + " " + objti + ":" + swt.swt[objt].desc;
      //console.log(wtxt);
    }
	wtxt += tcsig
    delim = wtxt.length/5;
    document.querySelector(":root").style.setProperty("--st",((-1*(wtxt.length*60)) + "px"));
    document.getElementById("weather").style.animation = "scrollsb " + (delim) + "s 1 linear";
    document.getElementById("weather").innerHTML = wtxt;
  }
  
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}
