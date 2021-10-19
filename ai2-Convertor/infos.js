function checkLog(d){
    console.log(d.$Type)
    if(d.$Type=="WebViewer"){
        document.getElementById("logs").innerHTML += "<label style='color:orange'>WebViewer will be converted to iframe" +
         " which some webpage does not support.</label><br>";
    }
    if(d.$Type=="Switch"){
        document.getElementById("logs").innerHTML += "<label style=''>Switch will be converted to Check Box.</label><br>"
    }
    if(d.$Type=="ListView" || d.$Type=="ListPicker"){
        document.getElementById("logs").innerHTML += "<label style=''>ListView,ListPicker,Spinner is currently not supported yet.</label><br>"
    }
    if(d.$Type=="DatePicker" || d.$Type=="TimePicker"){
        document.getElementById("logs").innerHTML += "<label style='color:orange'>Date and Time Picker is not supported in Internet Explore and Safari below version 14.1</label><br>"
    }
}