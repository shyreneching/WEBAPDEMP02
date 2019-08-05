var profImage = document.getElementById("profileImage");
var imgUp = document.getElementById("imageUpload");

(document.getElementById("profileImage")).click(function (e) {
        imgUp.click();
});

function fasterPreview(uploader) {
    if (uploader.files && uploader.files[0]) {
        profImage.attr('src',
            window.URL.createObjectURL(uploader.files[0]));
    }
}

function Prev() {
    fasterPreview(this);
}