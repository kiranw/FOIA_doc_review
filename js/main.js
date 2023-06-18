$(document).ready(function() {

    // Show grouped-show elements only when page is within page group, else hide
    $(".grouped-show").show();
    $(".grouped-hide").hide();

    $("#is-file-group").change(function() {
        $("#possible-grouping").toggleClass("grouped", this.checked)
        $(".grouped-hide").toggle();
        $(".grouped-show").toggle();

        console.log("changing")
    }).change();

});