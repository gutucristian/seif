// spawn pyrelic library
// var spawn = require("child_process").spawn;
// var process = spawn('python',["test.py", "add", 2, 3]);

// process.stdout.on('data', function (data) {
//     console.log('from python script: ' + data);    
// });

// var w = "Some super-secret ensemble key selector";
// var t = "Totally random and unpredictable tweak";
// var m = "This is a secret message";
var msk = "lkjasdf;lkjas;dlkfa;slkdf;laskdjf";
var s = "Super secret table value";

var w = "Wa_p747NO0Yh4ptIrbWA9vpmgopBgIzc";
var t = "dF8TaJeEXOgQyxJ9WtS_YcClt8pr8VPS"
var x = "AiR6SXA9ISufuC8Y31T1MRq6hi2DvyDNCJ2kDKTLaaah";

// 1. Web Server generates 't' (unique user id) 
// 2. Web Server obtains x (user password)
// 3. Web Server blinds x
// 4. Web Server queries pythia server with (w, t, x)

// w: server id
// t: user id
// x: blinded password that needs hardening

// Before everything, Pythia generates a global msk (master secret key) which is a random string
// Pythia receives query (w, t, x)
// Pythia generates a ensemble prekey K[W] (a random string)
// Pythia generates a ensemble key 'kw' unique to server 'w' (kw = HMAC(msk, K[W]))
// Pythia responds to server with hardened password Fkw(t,x)  

var spawn = require("child_process").spawn;
var process = spawn('python',["pyrelic/vpop.py", "eval", w, t, x, msk, s]);

process.stdout.on('data', function (data) {
    console.log("" + data);    
});