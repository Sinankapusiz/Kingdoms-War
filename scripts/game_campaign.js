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
    gameActions = new GameActions();
    constructor() {
        this._gameSituation = true;
        this.countryArray = new Array();
        this.playerArray = new Array();
        this.cityArray = new Array();
        this.buildingArray = new Array();
        this._loopSituation = false;
        this._gameLoopTimeSpeed = 1000;
        this._time = 0;
        this._gameLoop;
        this._gameLoopTime = 30;
    }
    async getBuildingData(path, buildingArray) {
        try {
            const response = await fetch(path);
            const buildings = await response.json();
            buildings.forEach(building => {
                buildingArray.push(
                    new Building(building.buildingId, building.buildingName, building.buildingImage, building.buildingLevel, building.buildingProfit, building.buildingDefinition, building.buildingCondition, building.buildingCraftMaterial)
                );
            });

        } catch (error) {
            console.error('Ülke verisi alınırken hata oluştu:', error);
        }
    };
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
    async getCitiesData(path, cityArray) {
        try {
            const response = await fetch(path);
            const cities = await response.json();
            cities.forEach(city => {
                cityArray.push(
                    new City(city.cityName, city.cityOwner, city.cityPopulation, city.cityWallLevel, city.cityRegion, city.cityRegionResource, city.cityBuildings)
                );
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
        await this.getCitiesData('./scripts/data/cities_data.json', this.cityArray);
        console.log(this.cityArray);
        await this.getBuildingData('./scripts/data/buildings_data.json', this.buildingArray);
        console.log(this.buildingArray);
        //this.playerArray.forEach(player => this.writeConcoleAllPlayerInfo(player));
        this.map.createCampaignMap();
        this.gameLoopStart( this._gameLoopTime, 5);
    };
    update() {
        console.log("Update Fonsiyonu Çalıştırıldı.");
        this.playerArray.forEach(player => {
            if (player.playerType === "computer") {
                const randomActionIndex = Math.floor(Math.random() * 3);
                console.log(randomActionIndex);
                switch (randomActionIndex) {
                    case 1:
                        console.log(player.playerCountry.countryName + " ülkesi(" + player.playerName + ") aşağıdaki eylemi gerçekleşti.");
                        this.gameActions.economicActions();
                        console.log("-------------------------------");
                        break;
                    case 2:
                        console.log(player.playerCountry.countryName + " ülkesi(" + player.playerName + ") aşağıdaki eylemi gerçekleşti.");
                        this.gameActions.militaryActions();
                        console.log("-------------------------------");
                        break;
                    case 3:
                        console.log(player.playerCountry.countryName + " ülkesi(" + player.playerName + ") aşağıdaki eylemi gerçekleşti.");
                        this.gameActions.diplomaticActions();
                        console.log("-------------------------------");
                        break;
                    default:
                        console.log("Eylem gerçekleşmedi.");
                        break;
                }
            }
        });
    };
    gameLoopStart( gameDuraction, infoInterval) {
        console.log("Oyun döngüsü başladı");
        this._gameLoop = setInterval(() => {
            if (this._loopSituation) {
                this._time++;
                console.log(this._time);
                console.log(this._gameLoopTimeSpeed);
                if (this._time % infoInterval === 0) {
                    this.update();
                }
                if (this._time >= gameDuraction) {
                    this.gameloopFinish();
                    //console.clear();
                    console.log("Oyun bitti.");
                }
            }
        }, this._gameLoopTimeSpeed);

    };
    gameloopFinish(){
        clearInterval(this._gameLoop);
    };
    gameLoopPause() {
        if (this._loopSituation) {
            const playGameBtn = document.getElementById("play-game-btn");
            playGameBtn.style.display = "block";
            const pauseGameBtn = document.getElementById("pause-game-btn");
            pauseGameBtn.style.display = "none";
            this._loopSituation = false;
            console.log("Oyun duraktırdı...");
        }
        else
            console.log("Oyun zaten durmuş durumda...");
    };
    gameLoopPlay() {
        if (!this._loopSituation) {
            const playGameBtn = document.getElementById("play-game-btn");
            playGameBtn.style.display = "none";
            const pauseGameBtn = document.getElementById("pause-game-btn");
            pauseGameBtn.style.display = "block";
            this._loopSituation = true;
            console.log("Oyun devam ediyor...");
        }
        else
            console.log("Oyun zaten devam ediyor...");
    };
    
    gameLoopTimeSpeedHalf() {
        this._gameLoopTimeSpeed = 2000;
        this.gameloopFinish();
        this.gameLoopStart( this._gameLoopTime, 5);
    };
    gameLoopTimeSpeedNormal() {
        this._gameLoopTimeSpeed = 1000;
        this.gameloopFinish();
        this.gameLoopStart( this._gameLoopTime, 5);
    };
    gameLoopTimeSpeedDouble() {
        this._gameLoopTimeSpeed = 500;
        this.gameloopFinish();
        this.gameLoopStart( this._gameLoopTime, 5);
    };
    showGameBarPanel(){
        const gameTimeBar = document.getElementById("game-time-bar");
        gameTimeBar.style.display = "flex";
        const playerCountryInfoBar = document.getElementById("player-country-info-bar");
        playerCountryInfoBar.style.display = "flex";
        const gameMenuPanel = document.querySelector(".game-menu");
        gameMenuPanel.style.display = "none";
        /*const gameFooterBar = document.getElementById("game-footer");
        gameFooterBar.style.display = "flex";*/
        const gameWallPaper = document.getElementById("game-wall-paper");
        gameWallPaper.style.display = "none";
    };
};
class GameActions {
    //Ana eylemler
    economicActions() {
        //Ekomik eylemler.
        console.log("Ekonomik Eylem Gerçekleştirildi.");
        //Para ile ilgili eylem.
        //Kaynak ile ilgili eylem.
        //Gelişim ile ilgili eylem.
    };
    militaryActions() {
        //Askeri eylemler.
        console.log("Askeri Eylem Gerçekleştirildi.");
    };
    diplomaticActions() {
        // Diplomatik eylemler.
        console.log("Diplomatik Eylem Gerçekleştirildi.");
    };


}
class Building {
    constructor(
        buildingId,
        buildingName,
        buildingImage,
        buildingLevel,
        buildingProfit,
        buildingDefinition,
        buildingCondition,
        buildingCraftMaterial
    ) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.buildingImage = buildingImage;
        this.buildingLevel = buildingLevel;
        this.buildingProfit = buildingProfit;
        this.buildingDefinition = buildingDefinition;
        this.buildingCondition = buildingCondition;
        this.buildingCraftMaterial = buildingCraftMaterial;
    }
}
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
class City {
    constructor(
        cityName,
        cityOwner,
        cityPopulation,
        cityWallLevel,
        cityRegion,
        cityRegionResource,
        cityBuildings
    ) {
        this.cityName = cityName;
        this.cityOwner = cityOwner;
        this.cityPopulation = cityPopulation;
        this.cityWallLevel = cityWallLevel;
        this.cityRegion = cityRegion;
        this.cityRegionResource = cityRegionResource;
        this.cityBuildings = cityBuildings;
    }
}
const game = new Game();

const newGameBtn = document.getElementById("new-game-btn");
const pauseGameBtn = document.getElementById("pause-game-btn");
const playGameBtn = document.getElementById("play-game-btn");
newGameBtn.addEventListener("click", () => {
    game.start();
    game.showGameBarPanel();
    const gameStartSound = new Audio("sounds/game-start-sound.mp3");
    gameStartSound.volume = 0.5;
    mainSoundPause();
    gameStartSound.play();
});
pauseGameBtn.addEventListener("click", () => {
    game.gameLoopPause();
});
playGameBtn.addEventListener("click", () => {
    game.gameLoopPlay();
});

const timeSpeedHalf = document.getElementById("time-speed-half-btn");
const timeSpeedNormal = document.getElementById("time-speed-normal-btn");
const timeSpeedDouble = document.getElementById("time-speed-double-btn");

timeSpeedHalf.addEventListener("click", () => {
    game.gameLoopTimeSpeedHalf();
});
timeSpeedNormal.addEventListener("click", () => {
    game.gameLoopTimeSpeedNormal();
});
timeSpeedDouble.addEventListener("click", () => {
    game.gameLoopTimeSpeedDouble();
});

const mainSoundControlBtn = document.getElementById("main-sound-btn");
const mainSound = new Audio("sounds/main_music.mp3");
let mainSoundSituation = false;

mainSoundControlBtn.addEventListener("click", () => {
    if (!mainSoundSituation) {
        mainSoundPlay();
        mainSoundSituation = true;
    } else {
        mainSoundPause();
        mainSoundSituation = false;
    }
});

function mainSoundPlay() {
    mainSound.play();
    mainSound.loop = true;
    mainSound.volume = 0.5;
    const mainSoundControlBtnOffIcon = document.getElementById("main-sound-off");
    mainSoundControlBtnOffIcon.style.display = "none";
    const mainSoundControlBtnOnIcon = document.getElementById("main-sound-on");
    mainSoundControlBtnOnIcon.style.display = "inline";
}

function mainSoundPause() {
    mainSound.pause();
    const mainSoundControlBtnOffIcon = document.getElementById("main-sound-off");
    mainSoundControlBtnOffIcon.style.display = "inline";
    const mainSoundControlBtnOnIcon = document.getElementById("main-sound-on");
    mainSoundControlBtnOnIcon.style.display = "none";
}

const btnEffectSound = new Audio("sounds/effect-Sound1.mp3");
const gameMenuBtns = document.querySelectorAll(".game-menu-btn");
gameMenuBtns.forEach(btn => {
    btn.addEventListener('mouseover', () => {
        btnEffectSound.volume = 0.5;
        btnEffectSound.play();
    })
    btn.addEventListener('mouseout', () => {
        btnEffectSound.pause();
        btnEffectSound.currentTime = 0;
    })
})
