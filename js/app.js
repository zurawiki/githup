/**
 * Created by roger on 3/3/14.
 */

function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
var postTemplate = "<li class='work'>\
<div class='relative'>\
    <span class='date' title='{{date}}'>{{prettyDate}}</span>\
    <span class='circle'>\
        <img class='icon-48' alt='{{author.username}}' src='{{author.imageUrl}}'/>\
    </span>\
    </div>\
    <div class='content'>\
        <label>{{message}}</label>\
        <p>\
    <a href='{{author.url}}'>{{author.username}}</a> pushed to <a href='{{repo.url}}'>{{repo.name}}</a>\
    </p><p>\
    <a href='{{url}}'>{{ hash }}</a><code>{{message}}</code>\
    </p></div>\
    <a href='#' class='glow icon-arrow-left'></a><a href='#' class='glow icon-arrow-right'></a></li>";
var template = Handlebars.compile(postTemplate);
var $tl = $('#timeline');
var activatedPos = null;
var scrollBusy = false;

var freeCB = function () {
    setTimeout(function () {
        scrollBusy = false;
    }, 100);
};

function scrollToId(id, time) {
    var windowW = $(window).width();
    var activeW = 714, normalW = 494;
    var offset = 100 + (activeW / 2) - (windowW / 2);

    $.scrollTo(offset + id * normalW, time, {axis: 'x', onAfter: freeCB, easing: 'swing'});
}
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
    scrollToId(activatedPos, 500);
}
function activateId(position) {
    return activate($tl.find('li').eq(position));
}
var only = function (cb) {
    return function (event) {
        event.stopPropagation();
        return cb();
    }
}

function tlForward() {
    if (activatedPos === null) {
        return activateId(0);
    }
    if (activatedPos >= 0 && activatedPos < $tl.find('li').length - 1) {
        return activateId(activatedPos + 1);
    }
    return false;
}

function tlBackward() {
    if (activatedPos === null) {
        return activateId(0);
    }
    if (activatedPos > 0 && activatedPos < $tl.find('li').length) {
        return activateId(activatedPos - 1);
    }
    return false;
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

var activateCb = function (event) {
    activate($(this));
};

var forLater = [];

function createItem(datum) {
    repoUrl = datum.url.split('/compare/')[0];
    repoName = repoUrl.split('https://github.com/')[1];
    datum.repo = {name: repoName, url: repoUrl};
    datum.hash = datum.url.split('...')[1];
    datum.prettyDate = moment(datum.date).add("days", 1).fromNow();

    return $(template(datum)).click(activateCb);
}

var addLater = function () {
    if (forLater != []) {
        datum = forLater.pop();
        var $el = createItem(datum);
        $('#timeline').prepend($el);
        scrollToId(++activatedPos, 0);
        activateId(activatedPos);

        setTimeout(addLater, (Math.random() * 60 + 10) * 1000);
    }
}

var loadData = function () {
data = 
[{"author":{"username":"nebkor","url":"https://github.com/nebkor","imageUrl":"https://avatars.githubusercontent.com/u/517215?v=3"},"date":"12/16/14 4:33 AM","message":"cuntpaste from original site","url":"https://github.com/nebkor/colortime/compare/1275de3d6f...185c99090b"},{"author":{"username":"harryyuan","url":"https://github.com/harryyuan","imageUrl":"https://avatars.githubusercontent.com/u/6745339?v=3"},"date":"12/16/14 1:31 AM","message":"remove fuck","url":"https://github.com/harryyuan/dos/compare/f9ae156e54...6be5707948"},{"author":{"username":"raphael22","url":"https://github.com/raphael22","imageUrl":"https://avatars.githubusercontent.com/u/3912356?v=3"},"date":"12/13/14 10:05 AM","message":"fucking userId","url":"https://github.com/raphael22/vidi/compare/ce7ca6ce60...9f2299e943"},{"author":{"username":"phathocker","url":"https://github.com/phathocker","imageUrl":"https://avatars.githubusercontent.com/u/4701218?v=3"},"date":"12/08/14 7:53 AM","message":"Updating bashit","url":"https://github.com/phathocker/fedora-config/compare/fe5038a9d3...6f1ac01dfc"},{"author":{"username":"cdglasz","url":"https://github.com/cdglasz","imageUrl":"https://avatars.githubusercontent.com/u/8548538?v=3"},"date":"11/24/14 5:57 PM","message":"Fixed fuck ups","url":"https://github.com/cdglasz/Galaga/compare/fa70f8be5e...18e6513a8d"},{"author":{"username":"TaylorP","url":"https://github.com/TaylorP","imageUrl":"https://avatars.githubusercontent.com/u/934474?v=3"},"date":"11/21/14 11:50 PM","message":"Fixed rollen's shit.","url":"https://github.com/TaylorP/FPGAFloat/compare/b16f4520c2...ad41a9cf28"},{"author":{"username":"mileszim","url":"https://github.com/mileszim","imageUrl":"https://avatars.githubusercontent.com/u/1849508?v=3"},"date":"11/21/14 10:56 PM","message":"Step 2: draw the rest of the fucking owl","url":"https://github.com/mileszim/dotfun/compare/df2f89fa8b...d97ba741b5"},{"author":{"username":"andrewcarreiro","url":"https://github.com/andrewcarreiro","imageUrl":"https://avatars.githubusercontent.com/u/1337095?v=3"},"date":"11/20/14 5:35 AM","message":"mother fuckin' pyramids","url":"https://github.com/andrewcarreiro/terrain-generator/compare/70db04c6ae...af1ae3bb08"},{"author":{"username":"ekweible","url":"https://github.com/ekweible","imageUrl":"https://avatars.githubusercontent.com/u/684353?v=3"},"date":"11/20/14 3:38 AM","message":"Fix stupid cap stuff","url":"https://github.com/ekweible/friendeopardy/compare/e8898a828e...ea642d792f"},{"author":{"username":"Tisza","url":"https://github.com/Tisza","imageUrl":"https://avatars.githubusercontent.com/u/3259591?v=3"},"date":"11/15/14 4:44 AM","message":"I fixed that onload thing (it was a stupid mistake I swear).","url":"https://github.com/BoardGame/client/compare/2ee7d3c224...348ea67ef5"},{"author":{"username":"mateozoto","url":"https://github.com/mateozoto","imageUrl":"https://avatars.githubusercontent.com/u/9751906?v=3"},"date":"11/14/14 7:42 PM","message":"url bar update shit","url":"https://github.com/mateozoto/cpsc481/compare/655ffad3a9...c8f09e1b90"},{"author":{"username":"yo2boy","url":"https://github.com/yo2boy","imageUrl":"https://avatars.githubusercontent.com/u/6931760?v=3"},"date":"11/10/14 3:37 AM","message":"gradle shit","url":"https://github.com/yo2boy/CPS633_Lab4/compare/94df1ce145...25b67b4272"},{"author":{"username":"Nukesor","url":"https://github.com/Nukesor","imageUrl":"https://avatars.githubusercontent.com/u/3322822?v=3"},"date":"11/05/14 7:26 PM","message":"Particles fixed, Lots of shit removed, Position set function fixed","url":"https://github.com/Gamemaker-AG/secret-octo-dangerzone/compare/f00ffcb808...bac0fd134a"},{"author":{"username":"aceofwings","url":"https://github.com/aceofwings","imageUrl":"https://avatars.githubusercontent.com/u/5874741?v=3"},"date":"11/02/14 1:48 AM","message":"Fixing this fucking shit","url":"https://github.com/aceofwings/ProjectMaze/compare/ac6297d1a1...622b6b84ec"},{"author":{"username":"nhhughes","url":"https://github.com/nhhughes","imageUrl":"https://avatars.githubusercontent.com/u/3633408?v=3"},"date":"10/31/14 1:06 AM","message":"The Great Documentation Re-fuckulation\n\nauthors: tmeehan","url":"https://github.com/SixAppeal/wpi-suite/compare/7c7ca9ed81...0ce8acbe04"},{"author":{"username":"jhon1125572","url":"https://github.com/jhon1125572","imageUrl":"https://avatars.githubusercontent.com/u/9345400?v=3"},"date":"10/30/14 9:55 PM","message":"fuck..","url":"https://github.com/ProyectosUniv/Proyecto_Metodos/compare/723318d338...30a2828383"},{"author":{"username":"theIncredibleMarek","url":"https://github.com/theIncredibleMarek","imageUrl":"https://avatars.githubusercontent.com/u/6849291?v=3"},"date":"10/28/14 8:51 AM","message":"test successfull you shit","url":"https://github.com/SmarandaDungeanu/CA3_OrderView/compare/e03e8d79af...e9e6046f42"},{"author":{"username":"writingbymatt","url":"https://github.com/writingbymatt","imageUrl":"https://avatars.githubusercontent.com/u/5807652?v=3"},"date":"10/26/14 11:31 PM","message":"fuck this thing and fuck it again","url":"https://github.com/writingbymatt/testsite/compare/2f769ac645...f743098a79"},{"author":{"username":"tedajax","url":"https://github.com/tedajax","imageUrl":"https://avatars.githubusercontent.com/u/821491?v=3"},"date":"10/24/14 9:47 PM","message":"more math shit","url":"https://github.com/tedajax/orryx/compare/702efd3e10...467ad5c7eb"},{"author":{"username":"dennisjs0910","url":"https://github.com/dennisjs0910","imageUrl":"https://avatars.githubusercontent.com/u/8176195?v=3"},"date":"10/22/14 3:42 PM","message":"shit works","url":"https://github.com/kristinechalk/Filmcred/compare/fcd0e32a1a...cf27b6e8ec"},{"author":{"username":"kevr","url":"https://github.com/kevr","imageUrl":"https://avatars.githubusercontent.com/u/1672189?v=3"},"date":"10/19/14 9:42 PM","message":"Recovered a fucked up merge","url":"https://github.com/BaseOfTheClick/PostSETI/compare/899e93392d...de06ca9150"},{"author":{"username":"JMarcu","url":"https://github.com/JMarcu","imageUrl":"https://avatars.githubusercontent.com/u/9279085?v=3"},"date":"10/17/14 7:00 AM","message":"Well fuck.","url":"https://github.com/JMarcu/CS1D/compare/02812bcf49...0cabbb6903"},{"author":{"username":"ordelore","url":"https://github.com/ordelore","imageUrl":"https://avatars.githubusercontent.com/u/7295977?v=3"},"date":"10/15/14 11:26 PM","message":"Add in code\n\nSFTP was being a douche.","url":"https://github.com/ordelore/PyPaint/compare/c8d18426e4...dc55fcac90"},{"author":{"username":"patrikqvarnstrom","url":"https://github.com/patrikqvarnstrom","imageUrl":"https://avatars.githubusercontent.com/u/7289535?v=3"},"date":"10/15/14 9:23 PM","message":"added shitloads of stuff","url":"https://github.com/patrikqvarnstrom/qvarnstrom/compare/d7467f7a05...56f5aed9db"},{"author":{"username":"gardleopard","url":"https://github.com/gardleopard","imageUrl":"https://avatars.githubusercontent.com/u/842541?v=3"},"date":"10/15/14 5:03 PM","message":"Normalize the shit out of hello kitty","url":"https://github.com/mehenkje/drengen/compare/8344037e93...4eac6f2e24"},{"author":{"username":"Sumeet-Jain","url":"https://github.com/Sumeet-Jain","imageUrl":"https://avatars.githubusercontent.com/u/3238734?v=3"},"date":"10/15/14 6:54 AM","message":"Changed to twilio cause shitty ass fucking google voice.","url":"https://github.com/Sumeet-Jain/stopSound/compare/cfca3e146d...9edcd350f6"},{"author":{"username":"Jvs34","url":"https://github.com/Jvs34","imageUrl":"https://avatars.githubusercontent.com/u/1412812?v=3"},"date":"10/14/14 2:58 PM","message":"Particle and apeshit fixes","url":"https://github.com/Jvs34/gmod-predictedentities/compare/1693de210e...749954737c"},{"author":{"username":"laraschmidt","url":"https://github.com/laraschmidt","imageUrl":"https://avatars.githubusercontent.com/u/6504764?v=3"},"date":"10/13/14 7:42 PM","message":"Added more testing and shit","url":"https://github.com/nacrooks/plocc/compare/b6c79460bd...e2d8b55c76"},{"author":{"username":"metabren","url":"https://github.com/metabren","imageUrl":"https://avatars.githubusercontent.com/u/749593?v=3"},"date":"10/13/14 3:26 AM","message":"Update Polish translations (thanks @m-codebastards).","url":"https://github.com/naked-apps/shoppe_core/compare/8439ea4aa3...15787d1a05"},{"author":{"username":"jaynus","url":"https://github.com/jaynus","imageUrl":"https://avatars.githubusercontent.com/u/2880909?v=3"},"date":"10/13/14 12:02 AM","message":"Fix fucking libcmt build issue","url":"https://github.com/jaynus/entityx/compare/898a091530...f16764bcd7"},{"author":{"username":"RomuloOliveira","url":"https://github.com/RomuloOliveira","imageUrl":"https://avatars.githubusercontent.com/u/3009157?v=3"},"date":"10/10/14 7:25 PM","message":"Fix some stupid characters","url":"https://github.com/RomuloOliveira/facebook-user-info/compare/22664bbfef...08c652fa03"},{"author":{"username":"purpasmart96","url":"https://github.com/purpasmart96","imageUrl":"https://avatars.githubusercontent.com/u/8182590?v=3"},"date":"10/09/14 4:28 PM","message":"Getting real tired of this shit","url":"https://github.com/purpasmart96/citra/compare/b90bb0bd95...4c4ec358bc"},{"author":{"username":"shimladnb","url":"https://github.com/shimladnb","imageUrl":"https://avatars.githubusercontent.com/u/8734041?v=3"},"date":"10/08/14 1:34 PM","message":"weg met al die ascci bullshit","url":"https://github.com/shimladnb/SOGMopdrachten/compare/f53b96ac3b...9976b33518"},{"author":{"username":"BlacqJack","url":"https://github.com/BlacqJack","imageUrl":"https://avatars.githubusercontent.com/u/472500?v=3"},"date":"10/08/14 11:41 AM","message":"fuck this thing\n\nfuck it","url":"https://github.com/BlacqJack/League-Log-Reader/compare/9c0f2057c0...311d89a2f3"},{"author":{"username":"tejo","url":"https://github.com/tejo","imageUrl":"https://avatars.githubusercontent.com/u/16240?v=3"},"date":"10/08/14 10:46 AM","message":"imports all of my shit","url":"https://github.com/Skatemate/skatemate/compare/54f13fccf9...bbb64d4263"},{"author":{"username":"Lapple","url":"https://github.com/Lapple","imageUrl":"https://avatars.githubusercontent.com/u/1042560?v=3"},"date":"10/08/14 10:12 AM","message":"fixing the trailing commas (stupidest parser error ever)","url":"https://github.com/Lapple/p5-plack-debugger/compare/88a4d9b6d9...2f9d93924d"},{"author":{"username":"sepehr","url":"https://github.com/sepehr","imageUrl":"https://avatars.githubusercontent.com/u/23576?v=3"},"date":"10/07/14 7:30 PM","message":"Reverted last commit, the stupid way!","url":"https://github.com/sepehr/laspotipy/compare/07ac92edb0...431c373b00"},{"author":{"username":"danielhams","url":"https://github.com/danielhams","imageUrl":"https://avatars.githubusercontent.com/u/397718?v=3"},"date":"10/05/14 3:12 PM","message":"Getting tired of your shit, emacs.","url":"https://github.com/danielhams/jack1/compare/0af149f371...c4b42ac89e"},{"author":{"username":"Groamer","url":"https://github.com/Groamer","imageUrl":"https://avatars.githubusercontent.com/u/6637441?v=3"},"date":"10/02/14 7:26 PM","message":"Syncbitch\n\nderp","url":"https://github.com/ProjectgroepB5/weerstation/compare/05fb5c0800...92da47a4d5"},{"author":{"username":"NikolaPavlov","url":"https://github.com/NikolaPavlov","imageUrl":"https://avatars.githubusercontent.com/u/7880688?v=3"},"date":"09/30/14 3:56 PM","message":"add style to bio.html continue the fight alone bitchez","url":"https://github.com/FluorescentYellow/HTML-CSSproject/compare/5e98a7dba8...813a642ace"},{"author":{"username":"tylerwaitt","url":"https://github.com/tylerwaitt","imageUrl":"https://avatars.githubusercontent.com/u/89749?v=3"},"date":"09/30/14 2:36 PM","message":"stupid webstorm","url":"https://github.com/tylerwaitt/node/compare/a9bb16e9ae...0d29b42232"},{"author":{"username":"submarines-and","url":"https://github.com/submarines-and","imageUrl":"https://avatars.githubusercontent.com/u/3114694?v=3"},"date":"09/30/14 12:33 PM","message":"lots of shit","url":"https://github.com/submarines-and/AngrySnakes/compare/a6804f451a...69483d4b41"},{"author":{"username":"wvbe","url":"https://github.com/wvbe","imageUrl":"https://avatars.githubusercontent.com/u/4198877?v=3"},"date":"09/29/14 12:03 AM","message":"Adding ui.stream(), fuck yeah","url":"https://github.com/wvbe/interfais/compare/98efd21225...fbaa0f13e7"}];

        // Split the array, some for now, more for later
        var half_length = Math.floor(data.length / 2);
        forLater = data.splice(0, half_length);

        for (var i = 0; i < data.length; i++) {
            var $el = createItem(data[i]);
            $('#timeline').append($el);
        }
        $('.icon-arrow-right').click(only(tlForward));
        $('.icon-arrow-left').click(only(tlBackward));
        $('li').fadeIn();
        $.scrollTo('100%', 0);
        $.scrollTo(0, 5000);
        activateId(0);
        setTimeout(addLater, Math.random() * 60 * 1000);
}


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
