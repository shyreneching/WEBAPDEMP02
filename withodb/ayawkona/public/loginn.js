var guestlink = document.getElementById("login_guest");
var guest;
var prof_navlink;
// Get the modal
var modal = document.getElementById("myModal");
var profilelink = document.getElementById("profile");

guestlink.onclick = function Guest(){
    guest = 1;
    localStorage.setItem("pleasework", guest);
    console.log(guest);
    console.log(localStorage.getItem("pleasework"));
}

console.log(guest);
console.log(localStorage.getItem("pleasework"));

function ChangeLinkName(){
    console.log(guest);
    guest = localStorage.getItem("pleasework");
    console.log(localStorage.getItem("pleasework"));
    prof_navlink = document.getElementById("profile");
    if(guest == 1){
        prof_navlink.textContent = "GUEST";
        console.log(prof_navlink.textContent);
        localStorage.setItem("whyy", prof_navlink.textContent);
        console.log(localStorage.getItem("whyy"));
        console.log(localStorage.getItem("whyy"));
        some = localStorage.getItem("whyy");
        console.log(some);
        if (some == "GUEST") {
            profilelink.onclick = function () {
                modal.style.display = "block";
                modal.style.zIndex = "6";
            }
        } 
        else if (some == "PROFILE") {
            profilelink.onclick = function () {
                window.location.href = "Profile.html"
            }
        }


        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
}
    }
    else {
        prof_navlink.textContent = "PROFILE";
        localStorage.setItem("whyy", prof_navlink.textContent);
        console.log(localStorage.getItem("whyy"));
        
        some = localStorage.getItem("whyy");
        console.log(some);
        if (some == "GUEST") {
            profilelink.onclick = function () {
                modal.style.display = "block";
                modal.style.zIndex = "6";
            }
        } else if (some == "PROFILE") {
            profilelink.onclick = function () {
                window.location.href = "Profile.html"
            }
        }


        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
}
// When the user clicks on the button, open the modal
console.log(localStorage.getItem("whyy"));
some = localStorage.getItem("whyy");
console.log(some);
if (some == "GUEST") {
    profilelink.onclick = function () {
        modal.style.display = "block";
        modal.style.zIndex = "6";
    }
} 
else if (some == "PROFILE") {
    profilelink.onclick = function () {
        window.location.href = "Profile.html"
    }
}


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}