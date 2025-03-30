class Ulke {

    constructor(
        _ulke_adi,
        _ulke_bayragi,
        _ulke_toplam_nufus,
        _ulke_sahip_oldugu_sehirler,
        _ulke_sahip_oldugu_bolgeler,
        _ulke_ticaret_ortaklari,
        _ulke_ulkelerle_iliskileri,
        _ulke_dostlari,
        _ulke_dusmanlari,
        _ulke_savasta_oldugu_ulkeler,
        _ulke_barista_oldugu_ulkeler,
        _ulke_zafer_hedefleri,
        _ulke_toplam_altin,
        _ulke_toplam_gida,
        _ulke_toplam_odun,
        _ulke_toplam_tas,
        _ulke_toplam_demir
    ) {
        this._ulke_adi = _ulke_adi;
        this._ulke_bayragi = _ulke_bayragi;
        this._ulke_toplam_nufus = _ulke_toplam_nufus;
        this._ulke_sahip_oldugu_sehirler = _ulke_sahip_oldugu_sehirler;
        this._ulke_sahip_oldugu_bolgeler = _ulke_sahip_oldugu_bolgeler;
        this._ulke_ticaret_ortaklari = _ulke_ticaret_ortaklari;
        this._ulke_ulkelerle_iliskileri = _ulke_ulkelerle_iliskileri;
        this._ulke_dostlari = _ulke_dostlari;
        this._ulke_dusmanlari = _ulke_dusmanlari;
        // Savaş-Barış
        this._ulke_savasta_oldugu_ulkeler = _ulke_savasta_oldugu_ulkeler;
        this._ulke_barista_oldugu_ulkeler = _ulke_barista_oldugu_ulkeler;
        // Zafer Hedefleri
        this._ulke_zafer_hedefleri = _ulke_zafer_hedefleri;
        //Ülke Kaynaklari
        this._ulke_toplam_altin = _ulke_toplam_altin;
        this._ulke_toplam_gida = _ulke_toplam_gida;
        this._ulke_toplam_odun = _ulke_toplam_odun;
        this._ulke_toplam_tas = _ulke_toplam_tas;
        this._ulke_toplam_demir = _ulke_toplam_demir;
    }
    ulkeToplamKaynakBilgisiniGoster() {
        return {
            "Toplam Altın": this._ulke_toplam_altin,
            "Toplam Gıda ": this._ulke_toplam_gida,
            "Toplam Odun": this._ulke_toplam_odun,
            "Toplam Taş": this._ulke_toplam_tas,
            "Toplam Demir": this._ulke_toplam_demir
        };
    }
}

const ulke1 = new Ulke(
    "Sinanium",
    "Kırmızı arkaplan üzerinde sarı bir aslan",
    100 + 200 + 300,
    ["city1", "city2"],
    ["b1", "b2"],
    ["ulke2", "ulke4"],
    ["ulke2 : 100", "ulke4:90"],
    ["ulke2"],
    ["ulke3"],
    ["ulke3"],
    ["ulke5"],
    ["b1", "b2", "b5", "b6"],
    100 + 150,
    150 + 20,
    50 + 20,
    23 + 65,
    24 + 60
);

class Sehir {
    constructor(
        sehir_adi,
        sehir_nufusu,
        sehir_sur_seviyesi,
        sehir_yapilari,
        sehir_yollari,
        sehir_yol_seviyesi,
        sehir_madeni
    ) {
        this.sehir_adi = sehir_adi;
        this.sehir_nufusu = sehir_nufusu;
        this.sehir_sur_seviyesi = sehir_sur_seviyesi;
        this.sehir_yapilari = sehir_yapilari;
        this.sehir_yollari = sehir_yollari;
        this.sehir_yol_seviyesi = sehir_yol_seviyesi;
        this.sehir_madeni = sehir_madeni;
    }
}

