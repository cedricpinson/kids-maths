
function getNumber10() {
    return Math.floor((Math.random() * 10) + 1);
}

window.currentAddition = undefined
    
function selectAddition()
{
    let a = getNumber10();
    let b = getNumber10();

    let text = a.toString() + " + " + b.toString() + " = ?";

    window.currentAddition = [ a, b ];
    let div = document.getElementById('text');
    div.innerHTML = text;

    let divResult = document.getElementById('result');
    divResult.innerHTML = "";
    divResult.style.backgroundColor = "white";            
}


window.onload= function() {
    document.getElementById('text').addEventListener("click", function() {
        selectAddition();
    });
};

document.addEventListener('keypress', function(event) {
    var div = document.getElementById('result');

    if (event.key == "Enter") {
        let result = parseInt(div.innerHTML);     
        if (window.currentAddition[0] + window.currentAddition[1] == result ) {
            div.style.backgroundColor = "green";            
        } else {
            div.style.backgroundColor = "red";            
        }
    } else {
        div.innerHTML += event.key;
    }
});
