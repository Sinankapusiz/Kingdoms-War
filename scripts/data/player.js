import {Oyuncu,oyuncu_turu,oyuncu_karakteri} from '../game.js';
import {_ulke1} from './country.js';
const _oyuncu1 = new Oyuncu(
    "Sinan",
    _ulke1,
    oyuncu_turu.Human,
    oyuncu_karakteri.Self
);
//_oyuncu1.oyuncuBilgileriniGoster();
//console.log(_oyuncu1.oyuncu_ulkesi.ulkeToplamKaynakBilgisiniGoster());
const _oyuncu2 = new Oyuncu(
    "Osman",
    "Osmanlı",
    oyuncu_turu.Computar,
    oyuncu_karakteri.Peaceful
);
//_oyuncu2.oyuncuBilgileriniGoster();