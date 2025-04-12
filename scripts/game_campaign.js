

const sehirler = [];
const sehirlerLabel = document.querySelectorAll(".cityNameLabel");



function sehirOlustur(pathJson) {
    fetch(pathJson)
        .then(response => response.json())
        .then(data => {
            data.forEach((sehir, index) => {
                console.log(`Şehir ${index + 1}:${sehir.sehir_adi} Oluşturuldu.`);
                sehirlerLabel[index].textContent = sehir.sehir_adi;
                sehirler.push(sehir);
            });
        })
        .catch(error => console.error('Şehir oluşturulken hata oluştu:', error)
        );
};
sehirOlustur('./scripts/data/cities_data.json');

function sehirSahiplerininBayraginiAta(pathJson) {
    fetch(pathJson)
        .then(response => response.json())
        .then(data => {
            data.forEach((ulke, index) => {
                ulke.ulke_sahip_oldugu_sehirler.forEach((city) => {
                    const cityN = document.getElementById(city[0]);
                    const cityFlagSembol = cityN.querySelector("path");
                    const cityFlagBackground = cityN.querySelector("polygon");

                    cityFlagSembol.setAttribute('d', ulke.ulke_bayragi.ulke_bayragi_sembol);
                    cityFlagSembol.id = ulke.ulke_bayragi.ulke_bayragi_sembol_color;
                    cityFlagBackground.id = ulke.ulke_bayragi.ulke_bayragi_arkaplan;
                    
                    const cityRegion = document.getElementById(city[2]);
                    cityRegion.style.fill = ulke.ulke_bolge.bolge_rengi;
                    cityRegion.style.stroke = ulke.ulke_bolge.bolge_kenar_rengi;
                    cityRegion.style.strokeWidth = "10px";
                })
            })
        })
};
sehirSahiplerininBayraginiAta('./scripts/data/countries_data.json');
