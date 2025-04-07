

const sehirler = [];
const sehirlerLabel = document.querySelectorAll(".cityNameLabel");

function sehirOlustur(pathJson){
    fetch(pathJson)
    .then(response => response.json())
    .then(data => {
        data.forEach((sehir,index) => {
            console.log(`Şehir ${index+1}:${sehir.sehir_adi} Oluşturuldu.`);
            sehirlerLabel[index].textContent = sehir.sehir_adi;
            sehirler.push(sehir);
        });
    })
    .catch(error => console.error('Şehir oluşturulken hata oluştu:', error)
);
};
sehirOlustur('./scripts/data/cities_data.json');