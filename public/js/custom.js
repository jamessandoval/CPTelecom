// Custom js scripts


// ensure active class is only on active links
$(".nav a").on("click", function() {
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
});


// new catogory addition
$('.review').click(function() {
    companyReview = $(this).closest('td').prev('td').prev('td').prev('td').prev('td').prev('td').text();
    location.href = "/reviews?companyName=" + companyReview;

});
