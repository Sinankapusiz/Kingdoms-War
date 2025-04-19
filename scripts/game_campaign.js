class Map {
    createCampaignMap() {
        this.createCity('./scripts/data/cities_data.json');
        this.setCityOwnerFlag('./scripts/data/countries_data.json');
    };
    async createCity(path) {
        try {
            const citiesNameLabel = document.querySelectorAll(".cityNameLabel");
            const response = await fetch(path);
            const cities = await response.json();
            cities.forEach((city, index) => {
                citiesNameLabel[index].textContent = city.cityName;
            });
        } catch (error) {
            console.error('Şehirler yüklenirken hata oluştu:', error);
        }
    };
    async setCityOwnerFlag(path) {
        try {
            const response = await fetch(path);
            const countries = await response.json();
            countries.forEach(country => {
                country.countryOwnedCities.forEach(city => {
                    const cityDiv = document.getElementById(city.cityId);
                    const cityFlagSembol = cityDiv.querySelector("path");
                    const cityFlagBackground = cityDiv.querySelector("polygon");

                    cityFlagSembol.setAttribute('d', country.countryFlag.countryFlagSymbol);
                    cityFlagSembol.id = country.countryFlag.countryFlagSymbolColor;
                    cityFlagBackground.id = country.countryFlag.countryFlagBackgroundId;

                    const cityRegion = document.getElementById(city.cityRegionId);
                    console.log(cityRegion);
                    cityRegion.style.fill = country.countryRegion.regionColor;
                    cityRegion.style.stroke = country.countryRegion.regionBorderColor;
                    cityRegion.style.strokeWidth = "10px";
                })

            });

        } catch (error) {
            console.error('Ülke bayrakları yüklenirken hata oluştu:', error);
        }

    }
};

class Game {
    map = new Map();
    constructor() {
        this.countryArray = new Array();
        this.playerArray = new Array();
    }
    async getCountriesData(path, countryArray) {
        try {
            const response = await fetch(path);
            const countries = await response.json();
            countries.forEach(country => {
                countryArray.push(
                    new Country(country.countryName, country.countryFlag, country.countryLeader, country.countryOwnedCities, country.countryRegion, country.countryResource)
                );
            });

        } catch (error) {
            console.error('Ülke verisi alınırken hata oluştu:', error);
        }
    };
    async getPlayersData(path, playerArray) {
        try {
            const response = await fetch(path);
            const players = await response.json();
            players.forEach(player => {
                playerArray.push(
                    new Player(player.playerId, player.playerName, this.countryArray.find(country => country.countryName === player.playerCountry), player.playerType)
                ); // Oyuncuları this.playerArray dizisine ekliyoruz
            });
        } catch (error) {
            console.error('Oyuncu verisi alınırken hata oluştu:', error);
        }
    };
    async getCitiesData(path) {
        try {
            const response = await fetch(path);
            const cities = await response.json();
            cities.forEach(city => {

            });
        } catch (error) {
            console.error('Şehir verisi alınırken hata oluştu:', error);
        }
    };
    async writeConcoleAllPlayerInfo(player) {
        console.log(`
            ${player.playerName} oyuncusu ve ${player.playerCountry.countryName} ülkesi oluşturuldu.
            ${player.playerCountry.countryName} ülkesi genel bilgiler;
            Ülke adı : ${player.playerCountry.countryName},
            Ülke bayrağı : ${player.playerCountry.countryFlag.countryFlagSymbol},
            Ülke lideri : ${player.playerCountry.countryLeader},
            Sahip şehir sayısı : ${player.playerCountry.countryOwnedCities.length},
            Sahip olunan şehirler :
                ${player.playerCountry.countryOwnedCities.map(city => city.cityName).join(", ")}
            Sahip olunan Kaynaklar :
                Gold(Altın) : ${player.playerCountry.countryResource.map(resource => resource.gold)},
                Food(Gıda) : ${player.playerCountry.countryResource.map(resource => resource.food)},
                Wood(Odun) : ${player.playerCountry.countryResource.map(resource => resource.wood)},
                Stone(Taş) : ${player.playerCountry.countryResource.map(resource => resource.stone)},
                Iron(Demir) : ${player.playerCountry.countryResource.map(resource => resource.iron)},
                Gold(Altın) : ${player.playerCountry.countryResource.map(resource => resource.gold)}
            `);
    }
    async start() {
        await this.getCountriesData('./scripts/data/countries_data.json', this.countryArray);
        console.log(this.countryArray);
        await this.getPlayersData('./scripts/data/players_data.json', this.playerArray); // getPlayersData fonksiyonunu bekliyoruz
        console.log(this.playerArray); // Veri alındıktan sonra playerArray'i yazdırıyoruz
        this.playerArray.forEach(player => this.writeConcoleAllPlayerInfo(player));

        this.map.createCampaignMap();
    };
    update() {

    };
};
class Player {
    constructor(playerId, playerName, playerCountry, playerType) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerCountry = playerCountry;
        this.playerType = playerType;
    }
}
class Country {
    constructor(
        countryName,
        countryFlag,
        countryLeader,
        countryOwnedCities,
        countryRegion,
        countryResource
    ) {
        this.countryName = countryName;
        this.countryFlag = countryFlag;
        this.countryLeader = countryLeader;
        this.countryOwnedCities = countryOwnedCities;
        this.countryRegion = countryRegion;
        this.countryResource = countryResource;
    }
}

const game = new Game();
game.start();



