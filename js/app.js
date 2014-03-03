/**
 * Created by roger on 3/3/14.
 */

function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
var postTemplate = "<li class='work'>\
            <input class='radio' id='{{hash}}' name='works' type='radio'>\
            <div class='relative'>\
            <label for='{{hash}}'>{{message}}</label>\
    <span class='date' data-date='{{date}}'>{{prettyDate}}</span>\
    <span class='circle'>\
        <img class='icon-48' alt='{{author.username}}' src='{{author.imageUrl}}'/>\
    </span>\
    </div>\
    <div class='content'>\
            <p>\
    <a href='{{author.url}}'>{{author.username}}</a> pushed to <a href='{{repo.url}}'>{{repo.name}}</a>\
    <br>\
    <a href='{{url}}'>{{ hash }}</a> <code>{{message}}</code>\
    </p></div>\
    <i class='glow icon-arrow-left'></i><i class='glow icon-arrow-right'></i></li>";
var template = Handlebars.compile(postTemplate);
var $tl = $('#timeline');
var activatedPos = null;
var scrollBusy = false;

var freeCB = function () {
    setTimeout(function () {
        scrollBusy = false;
    }, 100);
};

function activate($el) {
    $('.active').removeClass('active');
    $el.addClass('active');
    activatedPos = $el.index(); // TODO this line is potentially confusing
    hue = ((activatedPos * 3) + 120) % 256;
    $('body').css('background', 'hsl(' + hue + ', 30%, 33%)');
    $('.logo').css('color', 'hsl(' + hue + ', 30%, 33%)');

    if (activatedPos === 0) {
        $('#back').addClass('disabled');
    }
    else {
        $('#back').removeClass('disabled');
    }
    if (activatedPos === $tl.find('li').length - 1) {
        $('#next').addClass('disabled');
    }
    else {
        $('#next').removeClass('disabled');
    }
    $.scrollTo($el, 600, {margin: true, over: {'left': -0.7}, axis: 'x', onAfter: freeCB, easing: 'swing'});
}
function activateId(position) {
    return activate($tl.find('li').eq(position));
}

function tlForward() {
    if (activatedPos === null) {
        return activateId(0);
    }
    if (activatedPos >= 0 && activatedPos < $tl.find('li').length - 1) {
        return activateId(activatedPos + 1);
    }
    else {
        return false;
    }
}

function tlBackward() {
    if (activatedPos === null) {
        return activateId(0);
    }
    if (activatedPos > 0 && activatedPos < $tl.find('li').length) {
        return activateId(activatedPos - 1);
    }
    else {
        return false;
    }
}

$("body").mousewheel(function (event, delta) {
    if (scrollBusy) {
        return event.preventDefault();
    }
    scrollBusy = true;
    if (activatedPos === null) {
        activateId(0);
    }
    else {
        if (delta > 0) {
            tlBackward();
        }
        else if (delta < 0) {
            tlForward();
        }
        else {
            scrollBusy = false;
        }
    }
//        this.scrollLeft -= (delta * 30);
    event.preventDefault();
});

var activateCb = function () {
    activate($(this));
};

//    $('li').waypoint(activateCb, {horizontal:true, offset:'bottom-in-view'});

var loadData = function () {
    $.getJSON('http://cloud.rozu.co:9080/githup', function (data) {
        var time = 2;
        for (var i = 0; i < data.length; i++) {
            if (Math.random() > 0.9) {
                time++;
            }
            var datum = data[i];

            repoUrl = datum.url.split('/compare/')[0];
            repoName = repoUrl.split('https://github.com/')[1];
            datum.repo = {name: repoName, url: repoUrl};
            datum.hash = datum.url.split('...')[1];
            datum.time = time;
            datum.prettyDate = moment(datum.date).fromNow();

            var $el = $(template(datum)).click(activateCb);
            $('#timeline').append($el);
        }
        $('li').fadeIn();
        $.scrollTo('100%', 0);
        $.scrollTo('0%', 5000);
    });
}

$('#next').click(tlForward);
$('#back').click(tlBackward);

// animation code
$('li').hide();
$('ul').hide()
    .css({'margin-left': 'auto',
        'margin-right': 'auto',
        'border-top-width': '8px',
        'border-spacing': '0' })
    .show()
    .animate({'min-width': "100%"}, 2500)
    .animate({'border-top-width': '2px'}, 500, loadData)
    .animate({'margin-left': '0',
        'margin-right': '100px',
        'border-spacing': '100px 0'}, 0);
// size of border to be bigger
