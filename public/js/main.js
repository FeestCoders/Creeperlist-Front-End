function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('#tf-menu').addClass('stick');
    } else {
        $('#tf-menu').removeClass('stick');
    }
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'sip' : 'nop';
        console.log('Copiado? ' + msg);
    } catch (err) {
        console.log('Ni modo, no se pudo copiar :S');
    }
    document.body.removeChild(textArea);
}

$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});

$('.copy').click(function(event) {
    event.preventDefault();
    copyTextToClipboard($(this).attr('ip'));

    setTimeout(function() {
        $('.copy').popover('hide');
    }, 1000);
});

$(function () {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});