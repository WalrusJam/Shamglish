function screenshot() {
    html2canvas(document.body).then(function(canvas) {
        canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]))
    });
    add_screenshot_message();
}  

function rand_hex () {
    let hex_code = "#"
    for (let i = 0; i < 3; ++i) {
        let rgb_value = Math.round(255*Math.random()).toString(16);
        if (rgb_value.length == 1) {
            hex_code += "0";
        }
        hex_code += rgb_value;
    }
    return hex_code;
}

function add_screenshot_message () {
    const word_div = document.getElementById('gibberish');
    word_div.removeEventListener('click', screenshot)
    word_div.addEventListener('mouseleave', remove_screenshot_message);
    word_div.id = 'gibberish_sc';
}

function remove_screenshot_message () {
    const word_div = document.getElementById('gibberish_sc');
    word_div.removeEventListener('mouseleave', remove_screenshot_message)
    word_div.addEventListener('mouseenter', reset_screenshot_message);
}

function reset_screenshot_message () {
    const word_div = document.getElementById('gibberish_sc');
    word_div.removeEventListener('mouseenter', reset_screenshot_message)
    word_div.addEventListener('click', screenshot);
    word_div.id = 'gibberish';
}

function gen_word (max_pair_len) {
    let word_div = document.getElementById('gibberish');
    if (word_div == null) {
        word_div = document.getElementById('gibberish_sc');
    }
    const color_div = document.getElementById('accentcolor');
    if (word_div != null && color_div != null) {
        word_div.remove();
        color_div.remove();
    }
    
    let pair_length = Math.round((max_pair_len - 1) * Math.random()) + 1

    let consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x', 'z', 'ch', 'th', 'gh', 'st', 'sp', 'sh', 'fl', 'bl', 'gl', 'kl', 'cl', 'pl', 'pr', 'sl', 'sm', 'sn', 'gl', 'wh', 'ph', 'spl', 'sch', 'br', 'cr', 'dr', 'fr', 'gr', 'kr', 'tr', 'str', 'wr', 'sq', 'sw', 'kn', 'tw', 'y']; //ensure that 'y' is at end
    let middle_consonants = ['bb', 'ck', 'dd', 'ff', 'gg', 'll', 'lm', 'ln', 'mm', 'mn', 'nn', 'pp', 'rr', 'ss', 'tt', 'tl', 'vv', 'ng', 'xpl', 'zz', 'zzl', 'ssl', 'ddl', 'ckl', 'bbl', 'ffl', 'ggl', 'ppl', 'ttl', 'ntl', 'ngl', 'mpl', 'stl', 'ncl', 'nc', 'ct', 'ntr', 'nd', 'ndl', 'nf', 'nk', 'nkl', 'nf', 'mp', 'mph', 'mf', 'nr', 'ns', 'nt', 'mt', 'nw', 'nch', 'nth', 'nsh', 'rd', 'rsh', 'rch', 'rk', 'rb', 'rd', 'rc', 'rf', 'rg', 'rl', 'rm', 'rn', 'rp', 'rs', 'rt', 'rth', 'rv', 'ts', 'vr', 'dl', 'wn', 'xt', 'tch', 'nv', 'lb', 'ld', 'lk', 'lf', 'lg', 'lp', 'lt', 'lth', 'lch', 'lsh', 'gn', 'ght', 'sd', 'pt']
    let vowels = ['a','e','o','u','i','y'];
    let common_double_vowels = ['ea', 'ai', 'ia', 'ou', 'oi', 'eu', 'au', 'oa', 'ei', 'ie', 'io', 'iu', 'ui', 'ee', 'oo']
    let vowels_three_plus = ['eau', 'uai', 'uie', 'oui', 'ieu', 'iou', 'uou'];
    let endings = ['c', 'sm', 'st', 'n', 's', 'y', 'ey', 'l', 'ng', 'ck', 'ff', 'll', 'lm', 'ln', 'mn', 'm', 'pp', 'ss', 'tt', 'zz', 'nk', 'nc', 'nd', 'mp', 'nt', 'ns', 'mt', 'd', 'dd', 'nch', 'nth', 'nsh', 'rd', 'rsh', 'rch', 'rk', 'rb', 'rd', 'rc', 'rf', 'rg', 'rm', 'rn', 'rp', 'rs', 'rt', 'rth', 'sch', 't', 'p', 'b', 'r', 'w', 'x', 'wn', 'xt', 'tch', 'ct', 'lb', 'ld', 'lk', 'lf', 'lp', 'lt', 'lth', 'lsh', 'ght', 'pt']
    let common_endings = ['ious', 'ic', 'ous', 'ism', 'ist', 'ion', 'ian', 'ain', 'us', 'y', 'ng', 'ize', 'ice', 'ess', 'er', 'or', 'ar', 'ique', 'ity', 'al', 'ah', 'eh', 'oh', 'uh', 'able', 'ible', 'ance'];
    
    let pairs = [];

    function pick_consonant(chance_middle, chance_none, prev_vowel) {
        let exclude_y = prev_vowel[prev_vowel.length-1] == 'y' ? true : false;
        let c = consonants[Math.round((consonants.length-(exclude_y ? 2 : 1)) * Math.random())];
        c = Math.random() < chance_middle ? middle_consonants[Math.round((middle_consonants.length-1) * Math.random())] : c;
        c = Math.random() < chance_none ? '' : c;
        return c;
    }

    function pick_vowel_or_end(double, chance_end, prev_consonant, three_or_more) {
        let exclude_y = prev_consonant[prev_consonant.length-1] == 'y' ? true : false;
        let v = (double || exclude_y ? vowels[Math.round((vowels.length-2) * Math.random())] : vowels[Math.round((vowels.length-1) * Math.random())]) + (double ? vowels[Math.round((vowels.length-2) * Math.random())] : '');
        v = double && Math.random < 0.8 ? common_double_vowels[Math.round((common_double_vowels.length-1) * Math.random())] : v;
        v = three_or_more ? vowels_three_plus[Math.round((vowels_three_plus.length-1) * Math.random())] : v;
        let will_end = Math.random() < chance_end ? true : false;
        let end = will_end ? endings[Math.round((endings.length-1) * Math.random())] : '';
        let is_common = Math.random() < 0.7 ? true : false;
        end = will_end && is_common ? common_endings[Math.round((common_endings.length-1) * Math.random())] : end;

        if ('ey'.includes(end)) {
            end = v + pick_consonant(0.4, 0, v) + end;
        }
        else if (end == 'ng') {
            end = pick_vowel_or_end(false, 0, 'y') + end;
        }
        else if (!is_common) {
            end = v + end
        }

        return will_end ? end : v;
    }

    let c = '';
    let v = '';
    let pair = '';
    for (let i = 0; i < pair_length; ++i) {
        let double_vowel = Math.random() > 0.7 ? true : false;
        let triple_plus_vowel = Math.random() > 0.9 ? true : false;
        if (pairs.length == pair_length-1) {
            c = pick_consonant(pair_length == 1 ? 0 : 0.4, pair_length == 1 ? 0.2 : 0, v);
            v = pick_vowel_or_end(double_vowel, 0.7, c, triple_plus_vowel);
            pair = c + v;
        }
        else if (!pairs.length == 0) {
            c = pick_consonant(0.4, 0, v);
            v = pick_vowel_or_end(double_vowel, 0, c, triple_plus_vowel);
            pair = c + v;
        }
        else {
            c = pick_consonant(0, 0.2, v);
            v = pick_vowel_or_end(double_vowel, 0, c, c != '' ? triple_plus_vowel : false);
            pair = c + v;
        }
        pairs.push(pair);
    }

    let new_color = rand_hex();
    const new_word_div = document.createElement("div")
    const new_color_div = document.createElement("div")
    new_word_div.innerHTML = pairs.join("");
    new_color_div.innerHTML = new_color;
    document.body.appendChild(new_word_div);
    document.body.appendChild(new_color_div);
    new_word_div.id = "gibberish";
    new_word_div.className = "word";
    new_word_div.addEventListener('click', screenshot)
    new_color_div.id = "accentcolor";
    new_color_div.className = "hex";
    document.body.style = 'background-color:'+new_color;
    document.getElementById('pagetitle').style='color:#ffffff';
    document.getElementById('colorbutton').style='color:'+new_color;
}