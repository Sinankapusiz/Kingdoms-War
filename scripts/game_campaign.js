class Map {
    _UIControl = new UIControl();
    constructor() {
        this.selectedCity = new City();
    }
    getSelectedCity() {
        return this.selectedCity;
    };
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
                    // Bayrak ataması.
                    cityFlagSembol.setAttribute('d', country.countryFlag.countryFlagSymbol);
                    cityFlagSembol.id = country.countryFlag.countryFlagSymbolColor;
                    cityFlagBackground.id = country.countryFlag.countryFlagBackgroundId;
                    // Bölge rengi ataması.
                    const cityRegion = document.getElementById(city.cityRegionId);
                    cityRegion.style.fill = country.countryRegion.regionColor;
                    cityRegion.style.stroke = country.countryRegion.regionBorderColor;
                    cityRegion.style.strokeWidth = "10px";

                    //Bölge üzerine tıklanınca yapılacak işlemler.
                    cityRegion.addEventListener("click", () => {
                        this.mouseDownRegionColorChange(country.countryRegion, cityRegion);
                        this.selectedCity = city;
                        console.log(this.selectedCity.cityName);

                        const _ui = this._UIControl.getAllGameUIList();

                        const footerBuildingsCards = _ui.GameFootherBar.querySelectorAll(".building-info-card");
                        footerBuildingsCards.forEach(element => {
                            element.remove();
                        });

                        //Buildings
                        const selectedCityBuildings = game.cityArray.find(selectCity => selectCity.cityName === city.cityName);
                        this._UIControl.getCityBuildingsInfo(selectedCityBuildings.cityBuildings);

                        this._UIControl.showUI(_ui.GameFootherBar, this._UIControl.getDisplayValues().flex);
                        //UI başlık.
                        const cityNameSpan = _ui.SelectGameObjeContentNameDiv.querySelector("#name");
                        cityNameSpan.textContent = this.selectedCity.cityName;

                    });
                    cityRegion.addEventListener("mouseleave", () => {
                        this.mouseLeaveRegionColorChange(country.countryRegion, cityRegion);
                    });
                    cityRegion.addEventListener("mouseover", () => {
                        this.mouseOverRegionColorChange(country.countryRegion, cityRegion);
                    });
                })

            });

        } catch (error) {
            console.error('Ülke bayrakları yüklenirken hata oluştu:', error);
        };

    }
    mouseOverRegionColorChange(region, cityRegion) {
        // RGB veya RGBA ise işleyelim
        const rgbRegex = /rgb\((\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)(?:\s*\/\s*(\d+%?))?\)/;

        const match = region.regionColor.match(rgbRegex);

        if (match) {
            const r = match[1];
            const g = match[2];
            const b = match[3];
            const regionNewAlpha = "50%";
            const regionStrokeNewAlpha = "100%";
            // Yeni rgba olarak ayarla
            cityRegion.style.fill = `rgba(${r}, ${g}, ${b}, ${regionNewAlpha})`;
            cityRegion.style.stroke = `rgba(${r}, ${g}, ${b}, ${regionStrokeNewAlpha})`;
        }
    };
    mouseLeaveRegionColorChange(region, cityRegion) {
        // RGB veya RGBA ise işleyelim
        const rgbRegex = /rgb\((\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)(?:\s*\/\s*(\d+%?))?\)/;

        const match = region.regionColor.match(rgbRegex);

        if (match) {
            const r = match[1];
            const g = match[2];
            const b = match[3];
            const regionNewAlpha = "30%";
            const regionStrokeNewAlpha = "70%";
            // Yeni rgba olarak ayarla
            cityRegion.style.fill = `rgba(${r}, ${g}, ${b}, ${regionNewAlpha})`;
            cityRegion.style.stroke = `rgba(${r}, ${g}, ${b}, ${regionStrokeNewAlpha})`;
        }
    };
    mouseDownRegionColorChange(region, cityRegion) {
        // RGB veya RGBA ise işleyelim
        const rgbRegex = /rgb\((\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)(?:\s*\/\s*(\d+%?))?\)/;

        const match = region.regionColor.match(rgbRegex);

        if (match) {
            const r = match[1];
            const g = match[2];
            const b = match[3];
            const regionNewAlpha = "60%";
            const regionStrokeNewAlpha = "100%";
            // Yeni rgba olarak ayarla
            cityRegion.style.fill = `rgba(${r}, ${g}, ${b}, ${regionNewAlpha})`;
            cityRegion.style.stroke = `rgba(${r}, ${g}, ${b}, ${regionStrokeNewAlpha})`;
        }
    };
};
class UIControl {
    constructor() {
        this.gameFooterBar = document.getElementById("game-footer");
        this.gameTimeBar = document.getElementById("game-time-bar");
        this.playerCountryInfoBar = document.getElementById("player-country-info-bar");
        this.selectGameObjectContentNameDiv = document.getElementById("select-gameObje-content-name");
        this.selectGameObjeContentInfoPanel = document.getElementById("select-gameObje-content-info-panel");
        this.buildingModal = document.getElementById("building-modal");
        this.allGameUIList = {
            GameFootherBar: this.gameFooterBar,
            GameTimeBar: this.gameTimeBar,
            PlayerCountryInfoBar: this.playerCountryInfoBar,
            SelectGameObjeContentNameDiv: this.selectGameObjectContentNameDiv,
            SelectGameObjeContentInfoPanel: this.selectGameObjeContentInfoPanel,
            BuildingModal: this.buildingModal
        };
        this.displayValues = {
            none: "none",
            flex: "flex",
            block: "block",
            inline: "inline"
        };
    }
    getAllGameUIList() {
        return this.allGameUIList;
    }
    showUI(showUI, displayValue) {
        showUI.style.display = displayValue;
    }
    hideUI(hideUI) {
        hideUI.style.display = "none";
    }
    getDisplayValues() {
        return this.displayValues;
    }
    getCityBuildingsInfo(buildings) {
        if (buildings) {
            buildings.forEach((building) => {
                this.allGameUIList.SelectGameObjeContentInfoPanel.appendChild(this.createBuildingCard(building));
            });
        }
        if (!buildings) {
            console.log("HATA! buildings " + buildings);
        }

        console.log("getCityBuildingsInfo() Fonksiyonu çalıştı");

        const createBuildingBtn = document.createElement("div");
        createBuildingBtn.classList.add("building-info-card");
        createBuildingBtn.classList.add("building-new-build-card");
        createBuildingBtn.innerHTML = `<span class="building-name">Yeni Yapı</span>
                            <div>
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.000000 64.000000"
                                    preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)">
                                        <path
                                            d="M223 622 c-109 -39 -178 -112 -210 -221 -29 -102 4 -228 82 -306 122 -121 328 -121 450 0 91 92 118 241 64 356 -69 146 -241 223 -386 171z m214 -60 c51 -27 98 -73 126 -126 31 -58 31 -174 0 -232 -28 -53 -74 -99 -127 -127 -58 -31 -174 -31 -232 0 -217 115 -197 413 33 499 51 19 148 12 200 -14z" />
                                        <path
                                            d="M307 464 c-4 -4 -7 -31 -7 -61 l0 -53 -54 0 c-36 0 -58 -5 -66 -15 -19 -23 -2 -33 60 -37 l55 -3 3 -57 c3 -49 6 -58 22 -58 16 0 19 9 22 58 l3 57 55 3 c62 4 79 14 60 37 -8 10 -30 15 -66 15 l-53 0 -3 57 c-3 52 -14 73 -31 57z" />
                                    </g>
                                </svg>
                            </div>`;
        createBuildingBtn.addEventListener("click",()=>{
            this.showUI(this.allGameUIList.BuildingModal,this.displayValues.flex);
        });
        this.allGameUIList.SelectGameObjeContentInfoPanel.appendChild(createBuildingBtn);
    }
    createBuildingCard(building) {

        const buildingInfoCard = document.createElement("div");
        buildingInfoCard.classList.add("building-info-card");

        const buildingImgDiv = document.createElement("div");
        buildingImgDiv.classList.add("building-img");
        buildingInfoCard.appendChild(buildingImgDiv);

        const buildingImg = document.createElement("img");
        buildingImg.src = building.buildingImage;
        buildingImgDiv.appendChild(buildingImg);

        const buildingNameSpan = document.createElement("span");
        buildingNameSpan.classList.add("building-name");
        buildingNameSpan.textContent = building.buildingName;
        buildingInfoCard.appendChild(buildingNameSpan);

        return buildingInfoCard;
    }
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
};
class Player {
    constructor(playerId, playerName, playerCountry, playerType) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerCountry = playerCountry;
        this.playerType = playerType;
    }
};
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
};
class City {
    constructor(
        cityID,
        cityDivID,
        cityName,
        cityOwner,
        cityPopulation,
        cityWallLevel,
        cityRegion,
        cityRegionResource,
        cityBuildings
    ) {
        this.cityID = cityID;
        this.cityDivID = cityDivID;
        this.cityName = cityName;
        this.cityOwner = cityOwner;
        this.cityPopulation = cityPopulation;
        this.cityWallLevel = cityWallLevel;
        this.cityRegion = cityRegion;
        this.cityRegionResource = cityRegionResource;
        this.cityBuildings = cityBuildings;
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
        this._gameLoopTime = 200;
        //this.selectedCity = new City();
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
                    new City(city.cityID, city.cityDivID, city.cityName, city.cityOwner, city.cityPopulation, city.cityWallLevel, city.cityRegion, city.cityRegionResource, city.cityBuildings)
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
        document.body.addEventListener("click", (e) => {
            this.footerInfoPanelClose(e);
            this.buildingModalClose(e);
        });

        const footerCloseBtn = document.getElementById("close-footer-panel-btn");
        footerCloseBtn.addEventListener("click", () => {
            const _uiControl = new UIControl();
            _uiControl.hideUI(_uiControl.allGameUIList.GameFootherBar);        
        });

        const buildingModalCloseBtn = document.getElementById("close-building-modal-btn");
        buildingModalCloseBtn.addEventListener("click", () => {
            const _uiControl = new UIControl();
            _uiControl.hideUI(_uiControl.allGameUIList.BuildingModal);
        });

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
        this.gameLoopStart(this._gameLoopTime, 5);

    };
    update() {
        this.selectedCity = this.map.getSelectedCity();
        console.log(this.selectedCity.cityName);
        console.log("Update Fonsiyonu Çalıştırıldı.");
        this.playerArray.forEach(player => {
            if (player.playerType === "computer") {
                const randomActionIndex = this.gameActions.makeRandomActionNumber(0, 3);
                console.log("randomActionIndex " + randomActionIndex);

                switch (randomActionIndex) {
                    case 1:
                        console.log(player.playerCountry.countryName + " ülkesi(" + player.playerName + ") aşağıdaki eylemi gerçekleşti.");
                        this.gameActions.economicActions(player.playerCountry.countryOwnedCities, this.cityArray, this.buildingArray);
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
                        console.log(player.playerCountry.countryName + " ülkesi(" + player.playerName + ") eylem gerçekleştirmedi.");
                        console.log("Eylem gerçekleşmedi.");
                        break;
                }
            }
        });
    };
    gameLoopStart(gameDuraction, infoInterval) {
        console.log("Oyun döngüsü başladı");
        this._gameLoop = setInterval(() => {
            if (this._loopSituation) {
                this._time++;
                console.log("Geçen oyun süresi : " + this._time + " oyun hızı : " + this._gameLoopTimeSpeed);
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
    gameloopFinish() {
        clearInterval(this._gameLoop);
    };
    gameLoopPause() {
        if (this._loopSituation) {
            const playGameBtn = document.getElementById("play-game-btn");
            playGameBtn.style.display = "flex";
            const pauseGameBtn = document.getElementById("pause-game-btn");
            pauseGameBtn.style.display = "none";
            this._loopSituation = false;
            console.log("Oyun duraktırdı...");
        } else
            console.log("Oyun zaten durmuş durumda...");
    };
    gameLoopPlay() {
        if (!this._loopSituation) {
            const playGameBtn = document.getElementById("play-game-btn");
            playGameBtn.style.display = "none";
            const pauseGameBtn = document.getElementById("pause-game-btn");
            pauseGameBtn.style.display = "flex";
            this._loopSituation = true;
            console.log("Oyun devam ediyor...");
        } else
            console.log("Oyun zaten devam ediyor...");
    };

    gameLoopTimeSpeedHalf() {
        this._gameLoopTimeSpeed = 2000;
        this.gameloopFinish();
        this.gameLoopStart(this._gameLoopTime, 5);
    };
    gameLoopTimeSpeedNormal() {
        this._gameLoopTimeSpeed = 1000;
        this.gameloopFinish();
        this.gameLoopStart(this._gameLoopTime, 5);
    };
    gameLoopTimeSpeedDouble() {
        this._gameLoopTimeSpeed = 500;
        this.gameloopFinish();
        this.gameLoopStart(this._gameLoopTime, 5);
    };
    showGameBarPanel() {
        const gameTimeBar = document.getElementById("game-time-bar");
        gameTimeBar.style.display = "flex";
        const playerCountryInfoBar = document.getElementById("player-country-info-bar");
        playerCountryInfoBar.style.display = "flex";
        const gameMenuPanel = document.querySelector(".game-menu");
        gameMenuPanel.style.display = "none";
        const gameWallPaper = document.getElementById("game-wall-paper");
        gameWallPaper.style.display = "none";
    };
    footerInfoPanelClose(e) {
        const _uiControl = new UIControl();
        const excludedElements = [
            _uiControl.allGameUIList.GameFootherBar,
            _uiControl.allGameUIList.PlayerCountryInfoBar,
            _uiControl.allGameUIList.GameTimeBar,
            _uiControl.allGameUIList.BuildingModal
        ];
        const cities = document.querySelectorAll(".city");
        const regions = document.querySelectorAll(".region");

        cities.forEach(city => {
            excludedElements.push(city);
        });
        regions.forEach(region => {
            excludedElements.push(region);
        });

        const clickedInsideExcluded = excludedElements.some((el) => el && el.contains(e.target));

        if (!clickedInsideExcluded) {
            _uiControl.hideUI(_uiControl.allGameUIList.GameFootherBar);
        }
    };
    buildingModalClose(e) {
        const _uiControl = new UIControl();
        const excludedElements = [
            _uiControl.allGameUIList.GameFootherBar,
            _uiControl.allGameUIList.PlayerCountryInfoBar,
            _uiControl.allGameUIList.GameTimeBar,
            _uiControl.allGameUIList.BuildingModal
        ];
        const clickedInsideExcluded = excludedElements.some((el) => el && el.contains(e.target));

        if (!clickedInsideExcluded) {
            _uiControl.hideUI(_uiControl.allGameUIList.BuildingModal);
        }
    };
};
class GameActions {
    //Ana eylemler
    economicActions(playerCityArray, cityArray, buildingArray) {
        //Ekomik eylemler.
        console.log("Ekonomik Eylem Gerçekleştirildi.");

        /*const randomEconomyAction = this.makeRandomActionNumber(0, 3);
        console.log("randomEconomyAction = " + randomEconomyAction);*/

        // Oyuncunun bir şehri seçiliyor.
        const randomSelectionCitygAction = this.makeRandomActionNumber(0, playerCityArray.length - 1);
        const selectedCity = cityArray.find(city => city.cityName === playerCityArray[randomSelectionCitygAction].cityName);
        console.log("randomSelectionCitygAction " + randomSelectionCitygAction);

        //Rastgele bir yapı seçiliyor.(değişecek)
        const randomSelectionBuilding = this.makeRandomActionNumber(1, buildingArray.length);
        const selectedBuilding = buildingArray.find(building => building.buildingId === randomSelectionBuilding);

        //Yapı kontrolü yapılıyor. Eğer varsa eklenmiyor.
        if (selectedCity.cityBuildings.find(building => building.buildingId === selectedBuilding.buildingId) === undefined) {
            this.makeBuilding(selectedCity, selectedBuilding);
        } else {
            console.log(selectedBuilding.buildingName + " zaten bu şehirde var!");
        }
        /*switch (randomEconomyAction) {
            case 1:

                break;
            case 2:

                break;
            case 3:

                break;
            default:
                break;
        }*/
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
    /////

    /// Yardımcı eylem fonksiyonları

    // Minumum ve maksimum değer verilerek arasında bir değer döndürür.
    makeRandomActionNumber(minV, maxV) {
        if (minV === undefined)
            minV = 0;
        const randomActionNumber = Math.floor(Math.random() * (maxV - minV + 1)) + minV;
        return randomActionNumber;
    }

    makeBuilding(selectedCity, building) {
        console.log(selectedCity);
        console.log(building);
        console.log(building.buildingName + " yapısı " + selectedCity.cityName + " şehrine eklendi.");
        selectedCity.cityBuildings.push(building);
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

//Oyun Hızı işlemleri.
const timeSpeedHalf = document.getElementById("time-speed-half-btn");
const timeSpeedNormal = document.getElementById("time-speed-normal-btn");
const timeSpeedDouble = document.getElementById("time-speed-double-btn");

function timeBtnSelectStyleClear() {
    timeSpeedHalf.style.border = "none";
    timeSpeedNormal.style.border = "none";
    timeSpeedDouble.style.border = "none";
}

timeSpeedHalf.addEventListener("click", () => {
    timeBtnSelectStyleClear();
    game.gameLoopTimeSpeedHalf();
    timeSpeedHalf.style.border = "5px solid #d59637";
});
timeSpeedNormal.addEventListener("click", () => {
    timeBtnSelectStyleClear();
    game.gameLoopTimeSpeedNormal();
    timeSpeedNormal.style.border = "5px solid #d59637";
});
timeSpeedDouble.addEventListener("click", () => {
    timeBtnSelectStyleClear();
    game.gameLoopTimeSpeedDouble();
    timeSpeedDouble.style.border = "5px solid #d59637";
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