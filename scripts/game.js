class Oyuncu {
    constructor(
        oyuncu_adi,
        oyuncu_ulkesi,
        oyuncu_turu,
        oyuncu_karakteri
    ) {
        this.oyuncu_adi = oyuncu_adi;
        this.oyuncu_ulkesi = oyuncu_ulkesi;
        this.oyuncu_turu = oyuncu_turu;
        this.oyuncu_karakteri = oyuncu_karakteri;
    }
    oyuncuBilgileriniGoster() {

        console.log(`
            Oyuncu ${this.oyuncu_adi} Oluşturuldu.
            -----------------------------------------
            Oyuncu Adi : ${this.oyuncu_adi}
            Oyuncu Ülkesi : ${this.oyuncu_ulkesi.ulke_adi}
            Oyuncu Türü : ${this.oyuncu_turu}
            Oyuncu Karakteri : ${this.oyuncu_karakteri}
            -----------------------------------------
            `);
        return {
            durum: "Oyuncu Oluşturuldu.",
            "Oyuncu Adi": this.oyuncu_adi,
            "Oyuncu Ülkesi": this.oyuncu_ulkesi.ulke_adi,
            "Oyuncu Türü": this.oyuncu_turu,
            "Oyuncu Karakteri": this.oyuncu_karakteri,
        }
    }
};
const oyuncu_turu = {
    Human: "Human/İnsan",
    Computar: "Computar/Bilgisayar"
};
const oyuncu_karakteri = {
    Self: "Kendisi",
    Peaceful: "Peaceful/Barışcıl",
    Crafty: "Crafty/Kurnaz",
    Belligerent: "Belligerent/Saldırgan"
};

//Oyun içerisinde bulunan diğer oyuncular.
class Ulke {
    constructor(
        ulke_adi,
        ulke_bayragi,
        ulke_lideri,
        ulke_sahip_oldugu_sehirler,
        ulke_sahip_oldugu_bolgeler,
        ulke_ticaret_ortaklari,
        ulke_dostlari,
        ulke_dusmanlari,
        ulke_savasta_oldugu_ulkeler,
        ulke_barista_oldugu_ulkeler,
        ulke_zafer_hedefleri,
        ulke_kaynaklari
    ) {
        this.ulke_adi = ulke_adi;
        this.ulke_bayragi = ulke_bayragi;
        this.ulke_lideri = ulke_lideri;
        this.ulke_sahip_oldugu_sehirler = ulke_sahip_oldugu_sehirler;
        this.ulke_sahip_oldugu_bolgeler = ulke_sahip_oldugu_bolgeler;
        this.ulke_ticaret_ortaklari = ulke_ticaret_ortaklari;
        this.ulke_dostlari = ulke_dostlari;
        this.ulke_dusmanlari = ulke_dusmanlari;
        this.ulke_savasta_oldugu_ulkeler = ulke_savasta_oldugu_ulkeler;
        this.ulke_barista_oldugu_ulkeler = ulke_barista_oldugu_ulkeler;
        //this.ulke_ulkelerle_iliskileri = ulke_ulkelerle_iliskileri;
        // Zafer Hedefleri
        this.ulke_zafer_hedefleri = ulke_zafer_hedefleri;
        //Ülke Kaynaklari
        this.ulke_kaynaklari = ulke_kaynaklari;
    }

    ulkeToplamKaynakBilgisiniGoster() {
        return {
            "Toplam Altın": this.ulke_kaynaklari.Gold,
            "Toplam Gıda ": this.ulke_kaynaklari.Food,
            "Toplam Odun": this.ulke_kaynaklari.Wood,
            "Toplam Taş": this.ulke_kaynaklari.Stone,
            "Toplam Demir": this.ulke_kaynaklari.Iron
        };
    }
};
const ulke_ulkelerle_iliski_karakteri = {
    Neutral: "Neutral/Tarafsız",
    Friendly: "Friendly/Dostça",
    Hostile: "Hostile/Düşmanca"
};
//Geçici tanımlama Silinecek.
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
//Ülkeyi yöneten krallar.
class UlkeLideri {
    constructor(
        ulke_lideri_adi,
        ulke_lideri_resmi,
        ulke_lideri_karekter_ozellikleri,
        komutan_yetenekleri
    ) {
        this.ulke_lideri_adi = ulke_lideri_adi;
        this.ulke_lideri_resmi = ulke_lideri_resmi;
        this.ulke_lideri_karekter_ozellikleri = ulke_lideri_karekter_ozellikleri;
        this.komutan_yetenekleri = komutan_yetenekleri;
    }
};
//ülkelerin sahip olduğu yerler.
class Sehir {
    constructor(
        sehir_adi,
        sehir_nufusu,
        sehir_sur_seviyesi,
        sehir_yapilari,
        sehir_yollari,
        sehir_yol_seviyesi,
    ) {
        this.sehir_adi = sehir_adi;
        this.sehir_nufusu = sehir_nufusu;
        this.sehir_sur_seviyesi = sehir_sur_seviyesi;
        this.sehir_yapilari = sehir_yapilari;
        this.sehir_yollari = sehir_yollari;
        this.sehir_yol_seviyesi = sehir_yol_seviyesi;
    }
};
//Şehir yapıları.
class Yapi {
    constructor(
        yapi_adi,
        yapi_resmi,
        yapi_seviyesi,
        yapi_gideri,
        yapı_avantaji
    ) {
        this.yapi_adi = yapi_adi;
        this.yapi_resmi = yapi_resmi;
        this.yapi_seviyesi = yapi_seviyesi;
        this.yapi_gideri = yapi_gideri;
        this.yapı_avantaji = yapı_avantaji;
    }
};
//şehirlerin yolları
class Yol {
    constructor(
        yol_adi,
        yol_seviyesi,
        yol_uzunlugu
    ) {
        this.yol_adi = yol_adi;
        this.yol_seviyesi = yol_seviyesi;
        this.yol_uzunlugu = yol_uzunlugu;
    }
}
//Maden kaynak.
class Kaynak {
    constructor(
        kaynak_adi,
        kaynak_turu,
        kaynak_adeti
    ) {
        this.kaynak_adi = kaynak_adi;
        this.kaynak_turu = kaynak_turu;
        this.kaynak_adeti = kaynak_adeti;
    }
};
//Harita üzerindeki şehirlerin ve kaynakların bulunduğu alanlar.
class Bolge {
    constructor(
        bolge_adi,
        bolge_karakteri,
        bolge_sehri,
        bolge_tarim_degeri,
        bolge_ticaret_degeri,
        bolge_kaynagi
    ) {
        this.bolge_adi = bolge_adi;
        this.bolge_karakteri = bolge_karakteri;
        this.bolge_sehri = bolge_sehri;
        this.bolge_tarim_degeri = bolge_tarim_degeri;
        this.bolge_ticaret_degeri = bolge_ticaret_degeri;
        this.bolge_kaynagi = bolge_kaynagi;

    }
};
//Ülkelerin orduları.
class Ordu {
    constructor(
        ordu_adi,
        ordu_hizi,
        ordu_komutani,
        ordu_asker_unite_sayisi,
        ordu_asker_unitileri,
        ordu_toplam_morali
    ) {
        this.ordu_adi = ordu_adi;
        this.ordu_hizi = ordu_hizi;
        this.ordu_komutani = ordu_komutani;
        this.ordu_asker_unite_sayisi = ordu_asker_unite_sayisi;
        this.ordu_asker_unitileri = ordu_asker_unitileri;
        this.ordu_toplam_morali = ordu_toplam_morali;
    }
};

//Ordu komutanı
class Komutan {
    constructor(
        komutan_adi,
        komutan_resmi,
        komutan_yetenekleri
    ) {
        this.komutan_adi = komutan_adi;
        this.komutan_resmi = komutan_resmi;
        this.komutan_yetenekleri = komutan_yetenekleri;
    }
}
// Askeri birim.
class Askeri_Unite {
    constructor(
        askeri_unite_adi,
        askeri_unite_resmi,
        askeri_unite_asker_sayisi,
        askeri_unite_morali,
        askeri_unite_yakin_dovus,
        askeri_unite_hizi,
        askeri_unite_disiplin,
        askeri_unite_dayaniklik,
        askeri_unite_hucum_saldirisi,
        askeri_unite_cephanesi,
        askeri_unite_savunma,
        askeri_unite_zırh
    ) {
        this.askeri_unite_adi = askeri_unite_adi;
        this.askeri_unite_resmi = askeri_unite_resmi;
        this.askeri_unite_asker_sayisi = askeri_unite_asker_sayisi;
        this.askeri_unite_morali = askeri_unite_morali;
        this.askeri_unite_yakin_dovus = askeri_unite_yakin_dovus;
        this.askeri_unite_hizi = askeri_unite_hizi;
        this.askeri_unite_disiplin = askeri_unite_disiplin;
        this.askeri_unite_dayaniklik = askeri_unite_dayaniklik;
        this.askeri_unite_hucum_saldirisi = askeri_unite_hucum_saldirisi;
        this.askeri_unite_cephanesi = askeri_unite_cephanesi;
        this.askeri_unite_savunma = askeri_unite_savunma;
        this.askeri_unite_zırh = askeri_unite_zırh;
    }
};

//Ülkelerin yapdığı mücadele.
class Savas {
    constructor(
        saldiran_ulke,
        saldiran_ulke_destekcileri,
        savunan_ulke,
        savunan_ulke_destekcileri,
        saldiran_ulke_savas_puani,
        savunan_ulke_savas_puani,
        savas_durumu,
        savasi_kazanan_ulke,
        savasi_kaybeden_ulke,
        savas_hedefi
    ) {
        this.saldiran_ulke = saldiran_ulke;
        this.saldiran_ulke_destekcileri = saldiran_ulke_destekcileri;
        this.savunan_ulke = savunan_ulke;
        this.savunan_ulke_destekcileri = savunan_ulke_destekcileri;
        this.saldiran_ulke_savas_puani = saldiran_ulke_savas_puani;
        this.savunan_ulke_savas_puani = savunan_ulke_savas_puani;
        this.savas_durumu = savas_durumu;
        this.savasi_kazanan_ulke = savasi_kazanan_ulke;
        this.savasi_kaybeden_ulke = savasi_kaybeden_ulke;
        this.savas_hedefi = savas_hedefi;
    }
};

// orduların birbiriyle kapışması.
class Mucadele {
    constructor(
        saldiran_ulke,
        saldiran_ulke_destekcileri,
        savunan_ulke,
        savunan_ulke_destekcileri,
        saldiran_ulke_savas_puani,
        savunan_ulke_savas_puani,
        mucadele_durumu,
        mucadele_kazanan_ulke,
        mucadele_kaybeden_ulke
    ) {
        this.saldiran_ulke = saldiran_ulke;
        this.saldiran_ulke_destekcileri = saldiran_ulke_destekcileri;
        this.savunan_ulke = savunan_ulke;
        this.savunan_ulke_destekcileri = savunan_ulke_destekcileri;
        this.saldiran_ulke_mucadele_puani = saldiran_ulke_savas_puani;
        this.savunan_ulke_mucadele_puani = savunan_ulke_savas_puani;
        this.mucadele_durumu = mucadele_durumu;
        this.mucadele_kazanan_ulke = mucadele_kazanan_ulke;
        this.mucadele_kaybeden_ulke = mucadele_kaybeden_ulke;
    }
}

export {
    Oyuncu,
    oyuncu_turu,
    oyuncu_karakteri,
    Ulke
};

