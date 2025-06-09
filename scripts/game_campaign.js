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
                    cityFlagSembol.style.fill = country.countryFlag.countryFlagSymbolColor;
                    cityFlagSembol.style.transform = "translate(44%, 18%)";
                    cityFlagBackground.id = country.countryFlag.countryFlagBackgroundId;
                    cityFlagBackground.style.fill = country.countryFlag.countryFlagBackgroundColor;
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
                        setTimeout(() => {
                            _ui.GameFootherBar.style.top = "100%";
                        }, 300);
                        //UI başlık.
                        const cityNameSpan = _ui.SelectGameObjeContentNameDiv.querySelector("#name");
                        cityNameSpan.textContent = this.selectedCity.cityName;
                        game.selectedCity = game.cityArray.find(selectCity => selectCity.cityName === city.cityName);

                    });
                    cityRegion.addEventListener("mouseleave", () => {
                        this.mouseLeaveRegionColorChange(country.countryRegion, cityRegion);
                    });
                    cityRegion.addEventListener("mouseover", () => {
                        this.mouseOverRegionColorChange(country.countryRegion, cityRegion);
                    });
                    gameSoundControl.setGameBtnClickEffect(cityRegion);
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
        this.playerCountryFlag = document.getElementById("player-country-flag");
        this.allGameUIList = {
            GameFootherBar: this.gameFooterBar,
            GameTimeBar: this.gameTimeBar,
            PlayerCountryInfoBar: this.playerCountryInfoBar,
            SelectGameObjeContentNameDiv: this.selectGameObjectContentNameDiv,
            SelectGameObjeContentInfoPanel: this.selectGameObjeContentInfoPanel,
            BuildingModal: this.buildingModal,
            PlayerCountryFlag: this.playerCountryFlag
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
        this.allGameUIList.SelectGameObjeContentInfoPanel.innerHTML = "";
        if (buildings) {
            buildings.forEach((building) => {
                this.allGameUIList.SelectGameObjeContentInfoPanel.appendChild(this.createBuildingCard(building));
            });
        }
        if (!buildings) {
            console.log("HATA! buildings " + buildings);
        }
        const condition = buildings.length === game.buildingArray.length ? false : true;
        if (condition) {
            //Yeni Yapı Kartı. İnşa listesini açar..
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
            gameSoundControl.setGameBtnClickEffect(createBuildingBtn);
            createBuildingBtn.addEventListener("click", () => {
                this.showBuildingModal();
            });
            this.allGameUIList.SelectGameObjeContentInfoPanel.appendChild(createBuildingBtn);

        }

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

        const buildingProfit = document.createElement("div");
        buildingProfit.classList.add("building-profit");

        const buildingIconSize = 15;
        const buildingProfitContent = document.createElement("div");
        buildingProfitContent.classList.add("building-profit-content");

        Object.entries(building.buildingProfit).forEach(([key, value]) => {
            const spanProfit = document.createElement("span");
            switch (key) {
                case "food":
                    spanProfit.innerHTML = `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20"  xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.428 2.21198C10.31 2.10704 10.1575 2.04907 9.99952 2.04907C9.84156 2.04907 9.68908 2.10704 9.57102 2.21198C8.95665 2.75639 8.46666 3.42666 8.13433 4.17725C7.802 4.92784 7.63512 5.74117 7.64502 6.56198C7.646 6.648 7.66915 6.73231 7.71225 6.80676C7.75534 6.88121 7.81692 6.94329 7.89102 6.98698C8.53903 7.37019 9.12477 7.85005 9.62802 8.40998C9.6749 8.46203 9.7322 8.50364 9.7962 8.53213C9.8602 8.56061 9.92947 8.57533 9.99952 8.57533C10.0696 8.57533 10.1388 8.56061 10.2028 8.53213C10.2668 8.50364 10.3241 8.46203 10.371 8.40998C10.8744 7.85076 11.4601 7.37159 12.108 6.98898C12.1819 6.94516 12.2433 6.88303 12.2862 6.80859C12.3291 6.73415 12.3521 6.6499 12.353 6.56398C12.3632 5.74308 12.1965 4.9296 11.8644 4.17884C11.5322 3.42807 11.0423 2.7576 10.428 2.21298M3.01602 12.209C3.0082 12.1219 3.01771 12.034 3.04398 11.9506C3.07026 11.8672 3.11279 11.7897 3.16912 11.7228C3.22545 11.6559 3.29447 11.6008 3.3722 11.5606C3.44993 11.5205 3.53483 11.4962 3.62202 11.489C4.95342 11.3776 6.28609 11.6883 7.43094 12.377C8.57579 13.0658 9.47466 14.0976 10 15.326C10.5252 14.0975 11.4238 13.0657 12.5685 12.3767C13.7131 11.6878 15.0457 11.3769 16.377 11.488C16.743 11.518 17.017 11.84 16.983 12.208C16.8388 13.7907 16.1082 15.2623 14.9346 16.3339C13.761 17.4056 12.2293 17.9998 10.64 18H10.175C10.1156 17.9995 10.0564 17.9914 9.99902 17.976C9.94128 17.9915 9.8818 17.9996 9.82202 18H9.35702C7.76795 17.9996 6.23642 17.4052 5.06305 16.3336C3.88968 15.262 3.15921 13.7905 3.01502 12.208M10 10.826C9.47482 9.59736 8.57601 8.56536 7.43115 7.87644C6.28629 7.18751 4.95353 6.87665 3.62202 6.98798C3.53483 6.99515 3.44993 7.01951 3.3722 7.05964C3.29447 7.09977 3.22545 7.15489 3.16912 7.22182C3.11279 7.28874 3.07026 7.36616 3.04398 7.4496C3.01771 7.53304 3.0082 7.62085 3.01602 7.70798C3.09485 8.58536 3.35537 9.43673 3.78102 10.208C3.82396 10.2856 3.88679 10.3504 3.96306 10.3958C4.03933 10.4411 4.12629 10.4654 4.21502 10.466C5.22624 10.4748 6.22479 10.692 7.14837 11.1039C8.07194 11.5158 8.90073 12.1136 9.58302 12.86C9.63537 12.9171 9.70029 12.9614 9.77266 12.9891C9.84503 13.0169 9.92286 13.0275 10 13.02C10.077 13.0273 10.1546 13.0167 10.2268 12.9889C10.299 12.9611 10.3638 12.917 10.416 12.86C11.0983 12.1136 11.9271 11.5158 12.8507 11.1039C13.7742 10.692 14.7728 10.4748 15.784 10.466C15.8728 10.4653 15.9599 10.4409 16.0362 10.3954C16.1124 10.3498 16.1752 10.2848 16.218 10.207C16.6435 9.43603 16.904 8.58501 16.983 7.70798C16.9908 7.62085 16.9813 7.53304 16.9551 7.4496C16.9288 7.36616 16.8862 7.28874 16.8299 7.22182C16.7736 7.15489 16.7046 7.09977 16.6268 7.05964C16.5491 7.01951 16.4642 6.99515 16.377 6.98798C15.0457 6.87687 13.7131 7.18783 12.5685 7.87675C11.4238 8.56566 10.5252 9.59754 10 10.826Z" fill=" rgb(39, 165, 16)"/>
                        </svg>`;
                    break;
                case "wood":
                    spanProfit.innerHTML = `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <style>
                                            .cls-1 {
                                                fill: #c47510;
                                                stroke: #93570b;
                                                stroke-miterlimit: 10;
                                                stroke-width: 1.88px;
                                            }
                                        </style>
                                    </defs>
                                    <circle class="cls-1" cx="6.82" cy="17.18" r="5.32"></circle>
                                    <circle class="cls-1" cx="6.82" cy="17.18" r="2.35"></circle>
                                    <path class="cls-1" d="M20.94,10.59,10.59,20.94a5.32,5.32,0,0,0-7.53-7.53L13.41,3.06a5.32,5.32,0,0,1,7.53,7.53Z"></path>
                                    <line class="cls-1" x1="9.35" y1="12.41" x2="12.79" y2="8.97"></line>
                                    <line class="cls-1" x1="21.94" y1="4.36" x2="18.18" y2="8.12"></line>
                                    <line class="cls-1" x1="13.73" y1="13.18" x2="17.06" y2="9.85"></line>
                                    <line class="cls-1" x1="15.76" y1="5.41" x2="19.06" y2="2.12"></line>
                                </svg>`;
                    break;
                case "happiness":
                    spanProfit.innerHTML += value > 0 ? `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM13.493 7C13.6924 6.99491 13.8908 7.02979 14.0765 7.10259C14.2621 7.17538 14.4314 7.28463 14.5742 7.42387C14.717 7.56311 14.8304 7.72954 14.9079 7.91333C14.9853 8.09712 15.0252 8.29457 15.0251 8.49401C15.0251 8.69346 14.9851 8.89088 14.9075 9.07462C14.8299 9.25836 14.7163 9.42471 14.5735 9.56386C14.4306 9.703 14.2613 9.81213 14.0755 9.8848C13.8898 9.95748 13.6914 9.99223 13.492 9.987C13.1026 9.97679 12.7326 9.8149 12.4608 9.53582C12.189 9.25674 12.037 8.88255 12.0371 8.49301C12.0373 8.10347 12.1895 7.72939 12.4615 7.45049C12.7335 7.17159 13.1036 7.00995 13.493 7ZM6.5 7C6.69705 7.00007 6.89215 7.03894 7.07418 7.11441C7.2562 7.18988 7.42158 7.30046 7.56087 7.43984C7.70016 7.57922 7.81063 7.74467 7.88597 7.92675C7.96132 8.10882 8.00007 8.30395 8 8.501C7.99993 8.69805 7.96106 8.89315 7.88559 9.07518C7.81012 9.2572 7.69954 9.42258 7.56016 9.56187C7.42078 9.70116 7.25533 9.81163 7.07325 9.88697C6.89118 9.96232 6.69605 10.0011 6.499 10.001C6.10104 10.0009 5.71944 9.84265 5.43813 9.56116C5.15683 9.27967 4.99887 8.89796 4.999 8.5C4.99913 8.10204 5.15735 7.72044 5.43884 7.43913C5.72033 7.15783 6.10204 6.99987 6.5 7ZM10 16C6 16 5 12 5 12H15C15 12 14 16 10 16Z" fill="greenyellow"/>
                        </svg>` : `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM5 15H7C7 14.2044 7.31607 13.4413 7.87868 12.8787C8.44129 12.3161 9.20435 12 10 12C10.7956 12 11.5587 12.3161 12.1213 12.8787C12.6839 13.4413 13 14.2044 13 15H15C15 13.6739 14.4732 12.4021 13.5355 11.4645C12.5979 10.5268 11.3261 10 10 10C8.67392 10 7.40215 10.5268 6.46447 11.4645C5.52678 12.4021 5 13.6739 5 15ZM6 9C6.39782 9 6.77936 8.84196 7.06066 8.56066C7.34196 8.27936 7.5 7.89782 7.5 7.5C7.5 7.10218 7.34196 6.72064 7.06066 6.43934C6.77936 6.15804 6.39782 6 6 6C5.60218 6 5.22064 6.15804 4.93934 6.43934C4.65804 6.72064 4.5 7.10218 4.5 7.5C4.5 7.89782 4.65804 8.27936 4.93934 8.56066C5.22064 8.84196 5.60218 9 6 9ZM14 9C14.3978 9 14.7794 8.84196 15.0607 8.56066C15.342 8.27936 15.5 7.89782 15.5 7.5C15.5 7.10218 15.342 6.72064 15.0607 6.43934C14.7794 6.15804 14.3978 6 14 6C13.6022 6 13.2206 6.15804 12.9393 6.43934C12.658 6.72064 12.5 7.10218 12.5 7.5C12.5 7.89782 12.658 8.27936 12.9393 8.56066C13.2206 8.84196 13.6022 9 14 9Z" fill="crimson"/>
                        </svg>`;
                    break;
                case "cleaning":
                    spanProfit.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 2C4.47 2 2 4.46 2 7.5V8H4V7.5C4 6.57174 4.36875 5.6815 5.02513 5.02513C5.6815 4.36875 6.57174 4 7.5 4C9 4 10.26 4.93 10.76 6.24C10.37 6.08 9.95 6 9.5 6C8.11 6 6.9 6.82 6.34 8L8.08 9C8.29 8.42 8.85 8 9.5 8C9.89782 8 10.2794 8.15804 10.5607 8.43934C10.842 8.72064 11 9.10218 11 9.5V11H13V9.5C13 9.10218 13.158 8.72064 13.4393 8.43934C13.7206 8.15804 14.1022 8 14.5 8C15.16 8 15.71 8.42 15.92 9L17.66 8C17.1 6.82 15.9 6 14.5 6C14.05 6 13.63 6.08 13.24 6.24C13.74 4.93 15 4 16.5 4C17.4283 4 18.3185 4.36875 18.9749 5.02513C19.6313 5.6815 20 6.57174 20 7.5V8H22V7.5C22 6.04131 21.4205 4.64236 20.3891 3.61091C19.3576 2.57946 17.9587 2 16.5 2C14.64 2 13 2.93 12 4.34C11 2.93 9.36 2 7.5 2ZM6 12V14H7.42C7.92 15.15 8.85 16.07 10 16.57V19H2C2 19 2.82 20.23 3.41 21.11C3.78 21.67 4.4 22 5.07 22H18.93C19.6 22 20.22 21.67 20.59 21.11L22 19H14V16.57C15.15 16.07 16.08 15.15 16.58 14H18V12H6Z" fill="${value > 0 ? "greenyellow":"crimson"}"/>
                        </svg>`;
                    break;
                case "gold":
                    spanProfit.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.375 6.99766V6.5625C14.375 4.60313 11.4195 3.125 7.5 3.125C3.58047 3.125 0.625 4.60313 0.625 6.5625V9.6875C0.625 11.3195 2.67578 12.6164 5.625 13.0047V13.4375C5.625 15.3969 8.58047 16.875 12.5 16.875C16.4195 16.875 19.375 15.3969 19.375 13.4375V10.3125C19.375 8.69531 17.3891 7.39687 14.375 6.99766ZM4.375 11.4742C2.84453 11.0469 1.875 10.343 1.875 9.6875V8.58828C2.5125 9.03984 3.36641 9.40391 4.375 9.64844V11.4742ZM10.625 9.64844C11.6336 9.40391 12.4875 9.03984 13.125 8.58828V9.6875C13.125 10.343 12.1555 11.0469 10.625 11.4742V9.64844ZM9.375 15.2242C7.84453 14.7969 6.875 14.093 6.875 13.4375V13.1117C7.08047 13.1195 7.28828 13.125 7.5 13.125C7.80313 13.125 8.09922 13.1148 8.38984 13.0977C8.71271 13.2132 9.04157 13.3113 9.375 13.3914V15.2242ZM9.375 11.7383C8.75422 11.83 8.12751 11.8757 7.5 11.875C6.87249 11.8757 6.24578 11.83 5.625 11.7383V9.87969C6.24671 9.96064 6.87305 10.0008 7.5 10C8.12695 10.0008 8.75329 9.96064 9.375 9.87969V11.7383ZM14.375 15.4883C13.1316 15.6705 11.8684 15.6705 10.625 15.4883V13.625C11.2465 13.7085 11.8729 13.7503 12.5 13.75C13.127 13.7508 13.7533 13.7106 14.375 13.6297V15.4883ZM18.125 13.4375C18.125 14.093 17.1555 14.7969 15.625 15.2242V13.3984C16.6336 13.1539 17.4875 12.7898 18.125 12.3383V13.4375Z" fill="gold"/>
                        </svg>`;
                    break;
                case "population":
                    spanProfit.innerHTML += `<svg fill="#ffffff" width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <title>users-solid</title>
                                        <path class="clr-i-solid clr-i-solid-path-1" d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z">
                                        </path>
                                        <path class="clr-i-solid clr-i-solid-path-2" d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z">
                                        </path>
                                        <path class="clr-i-solid clr-i-solid-path-3" d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z">
                                        </path>
                                        <path class="clr-i-solid clr-i-solid-path-4" d="M24.43,13.44a6.54,6.54,0,0,1,0,.69,4.09,4.09,0,0,0,.58.05h.19A4.09,4.09,0,1,0,21.47,8,6.53,6.53,0,0,1,24.43,13.44Z">
                                        </path>
                                        <circle class="clr-i-solid clr-i-solid-path-5" cx="17.87" cy="13.45" r="4.47">
                                        </circle>
                                        <path class="clr-i-solid clr-i-solid-path-6" d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z">
                                        </path>
                                        <rect x="0" y="0" width="20" height="20" fill-opacity="0"></rect>
                                    </g>
                                </svg>`;
                    break;
                case "iron":
                    spanProfit.innerHTML += `<svg fill="#cbcbcb" width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <title>gold-bar</title>
                                    <path d="M11.652 19.245l-0.001-0.001-0.005-0.003zM30.671 16.098l-2.207-5.839-8.022-4.361-16.624 8.861-2.431 6.495 9.8 5.214 0.161-7.067-7.624-4.353 0.654 0.346-0.373-0.215 1.332 0.708-1.212-0.708 7.526 4.065 16.205-8.376-2.594 1.424 3.037-1.551-6.011 3.183-10.434 5.727-0.668 6.816 19.484-10.371zM11.976 17.206l-4.389-2.342 4.269 1.32 13.070-5.8-12.95 6.822z">
                                    </path>
                                </svg>`;
                    break;
                case "stone":
                    spanProfit.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#959595" d="M209.875 44.156l-182 106.47 119.625 54.31 148.344 11.72 41.97-24.312 17.342 11.562L309 230.656V379.53l53.563-14.624-64.625 51.97-110.875-59.626-2.157-1.53-71.28 6.56 75.936-31.967 100.75 52.125v-147.5l-145.906-11.5-1.625-.125-1.5-.688-121.093-55V391.47L44 423.186l82 20.97 21.875-21.282 11.156 29.72 131.282 33.592V434l4.25 2.28 5.47 2.94 4.812-3.908L309 431.97v52.155L491.375 377.78v-96.405L466.78 269.47l24.595-38.75V125l-90.25 52.28-1.094 34.095-88-58.688 84.97 5.375L476.5 112 291.562 64.937l1.625.563-64.406 5.78 5.345-20.936-24.25-6.188z"></path>
                                </svg>`;
                    break;

                default:
                    break;
            }
            if (value < 0) {
                spanProfit.classList.add("building-negative");
                spanProfit.innerHTML += value;
            } else {
                spanProfit.classList.add("building-positive");
                spanProfit.innerHTML += "+" + value;
            }
            buildingProfitContent.appendChild(spanProfit);
        });

        buildingProfit.appendChild(buildingProfitContent);
        buildingInfoCard.appendChild(buildingProfit);
        gameSoundControl.setGameBtnClickEffect(buildingInfoCard);
        return buildingInfoCard;
    };
    showBuildingModal() {
        this.showUI(this.allGameUIList.BuildingModal, this.displayValues.flex);
        const buildContent = this.allGameUIList.BuildingModal.querySelector(".content");
        buildContent.innerHTML = ""; //div içerisini temizliyoruz.
        game.buildingArray.forEach((building) => {
            const buildingIconSize = 15;
            const buildingProfitContent = document.createElement("div");
            Object.entries(building.buildingProfit).forEach(([key, value]) => {
                const spanProfit = document.createElement("span");
                switch (key) {
                    case "food":
                        spanProfit.innerHTML = `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20"  xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.428 2.21198C10.31 2.10704 10.1575 2.04907 9.99952 2.04907C9.84156 2.04907 9.68908 2.10704 9.57102 2.21198C8.95665 2.75639 8.46666 3.42666 8.13433 4.17725C7.802 4.92784 7.63512 5.74117 7.64502 6.56198C7.646 6.648 7.66915 6.73231 7.71225 6.80676C7.75534 6.88121 7.81692 6.94329 7.89102 6.98698C8.53903 7.37019 9.12477 7.85005 9.62802 8.40998C9.6749 8.46203 9.7322 8.50364 9.7962 8.53213C9.8602 8.56061 9.92947 8.57533 9.99952 8.57533C10.0696 8.57533 10.1388 8.56061 10.2028 8.53213C10.2668 8.50364 10.3241 8.46203 10.371 8.40998C10.8744 7.85076 11.4601 7.37159 12.108 6.98898C12.1819 6.94516 12.2433 6.88303 12.2862 6.80859C12.3291 6.73415 12.3521 6.6499 12.353 6.56398C12.3632 5.74308 12.1965 4.9296 11.8644 4.17884C11.5322 3.42807 11.0423 2.7576 10.428 2.21298M3.01602 12.209C3.0082 12.1219 3.01771 12.034 3.04398 11.9506C3.07026 11.8672 3.11279 11.7897 3.16912 11.7228C3.22545 11.6559 3.29447 11.6008 3.3722 11.5606C3.44993 11.5205 3.53483 11.4962 3.62202 11.489C4.95342 11.3776 6.28609 11.6883 7.43094 12.377C8.57579 13.0658 9.47466 14.0976 10 15.326C10.5252 14.0975 11.4238 13.0657 12.5685 12.3767C13.7131 11.6878 15.0457 11.3769 16.377 11.488C16.743 11.518 17.017 11.84 16.983 12.208C16.8388 13.7907 16.1082 15.2623 14.9346 16.3339C13.761 17.4056 12.2293 17.9998 10.64 18H10.175C10.1156 17.9995 10.0564 17.9914 9.99902 17.976C9.94128 17.9915 9.8818 17.9996 9.82202 18H9.35702C7.76795 17.9996 6.23642 17.4052 5.06305 16.3336C3.88968 15.262 3.15921 13.7905 3.01502 12.208M10 10.826C9.47482 9.59736 8.57601 8.56536 7.43115 7.87644C6.28629 7.18751 4.95353 6.87665 3.62202 6.98798C3.53483 6.99515 3.44993 7.01951 3.3722 7.05964C3.29447 7.09977 3.22545 7.15489 3.16912 7.22182C3.11279 7.28874 3.07026 7.36616 3.04398 7.4496C3.01771 7.53304 3.0082 7.62085 3.01602 7.70798C3.09485 8.58536 3.35537 9.43673 3.78102 10.208C3.82396 10.2856 3.88679 10.3504 3.96306 10.3958C4.03933 10.4411 4.12629 10.4654 4.21502 10.466C5.22624 10.4748 6.22479 10.692 7.14837 11.1039C8.07194 11.5158 8.90073 12.1136 9.58302 12.86C9.63537 12.9171 9.70029 12.9614 9.77266 12.9891C9.84503 13.0169 9.92286 13.0275 10 13.02C10.077 13.0273 10.1546 13.0167 10.2268 12.9889C10.299 12.9611 10.3638 12.917 10.416 12.86C11.0983 12.1136 11.9271 11.5158 12.8507 11.1039C13.7742 10.692 14.7728 10.4748 15.784 10.466C15.8728 10.4653 15.9599 10.4409 16.0362 10.3954C16.1124 10.3498 16.1752 10.2848 16.218 10.207C16.6435 9.43603 16.904 8.58501 16.983 7.70798C16.9908 7.62085 16.9813 7.53304 16.9551 7.4496C16.9288 7.36616 16.8862 7.28874 16.8299 7.22182C16.7736 7.15489 16.7046 7.09977 16.6268 7.05964C16.5491 7.01951 16.4642 6.99515 16.377 6.98798C15.0457 6.87687 13.7131 7.18783 12.5685 7.87675C11.4238 8.56566 10.5252 9.59754 10 10.826Z" fill=" rgb(39, 165, 16)"/>
                        </svg>`;
                        break;
                    case "wood":
                        spanProfit.innerHTML = `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <style>
                                            .cls-1 {
                                                fill: #c47510;
                                                stroke: #93570b;
                                                stroke-miterlimit: 10;
                                                stroke-width: 1.88px;
                                            }
                                        </style>
                                    </defs>
                                    <circle class="cls-1" cx="6.82" cy="17.18" r="5.32"></circle>
                                    <circle class="cls-1" cx="6.82" cy="17.18" r="2.35"></circle>
                                    <path class="cls-1" d="M20.94,10.59,10.59,20.94a5.32,5.32,0,0,0-7.53-7.53L13.41,3.06a5.32,5.32,0,0,1,7.53,7.53Z"></path>
                                    <line class="cls-1" x1="9.35" y1="12.41" x2="12.79" y2="8.97"></line>
                                    <line class="cls-1" x1="21.94" y1="4.36" x2="18.18" y2="8.12"></line>
                                    <line class="cls-1" x1="13.73" y1="13.18" x2="17.06" y2="9.85"></line>
                                    <line class="cls-1" x1="15.76" y1="5.41" x2="19.06" y2="2.12"></line>
                                </svg>`;
                        break;
                    case "happiness":
                        spanProfit.innerHTML += value > 0 ? `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM13.493 7C13.6924 6.99491 13.8908 7.02979 14.0765 7.10259C14.2621 7.17538 14.4314 7.28463 14.5742 7.42387C14.717 7.56311 14.8304 7.72954 14.9079 7.91333C14.9853 8.09712 15.0252 8.29457 15.0251 8.49401C15.0251 8.69346 14.9851 8.89088 14.9075 9.07462C14.8299 9.25836 14.7163 9.42471 14.5735 9.56386C14.4306 9.703 14.2613 9.81213 14.0755 9.8848C13.8898 9.95748 13.6914 9.99223 13.492 9.987C13.1026 9.97679 12.7326 9.8149 12.4608 9.53582C12.189 9.25674 12.037 8.88255 12.0371 8.49301C12.0373 8.10347 12.1895 7.72939 12.4615 7.45049C12.7335 7.17159 13.1036 7.00995 13.493 7ZM6.5 7C6.69705 7.00007 6.89215 7.03894 7.07418 7.11441C7.2562 7.18988 7.42158 7.30046 7.56087 7.43984C7.70016 7.57922 7.81063 7.74467 7.88597 7.92675C7.96132 8.10882 8.00007 8.30395 8 8.501C7.99993 8.69805 7.96106 8.89315 7.88559 9.07518C7.81012 9.2572 7.69954 9.42258 7.56016 9.56187C7.42078 9.70116 7.25533 9.81163 7.07325 9.88697C6.89118 9.96232 6.69605 10.0011 6.499 10.001C6.10104 10.0009 5.71944 9.84265 5.43813 9.56116C5.15683 9.27967 4.99887 8.89796 4.999 8.5C4.99913 8.10204 5.15735 7.72044 5.43884 7.43913C5.72033 7.15783 6.10204 6.99987 6.5 7ZM10 16C6 16 5 12 5 12H15C15 12 14 16 10 16Z" fill="greenyellow"/>
</svg>` : `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM5 15H7C7 14.2044 7.31607 13.4413 7.87868 12.8787C8.44129 12.3161 9.20435 12 10 12C10.7956 12 11.5587 12.3161 12.1213 12.8787C12.6839 13.4413 13 14.2044 13 15H15C15 13.6739 14.4732 12.4021 13.5355 11.4645C12.5979 10.5268 11.3261 10 10 10C8.67392 10 7.40215 10.5268 6.46447 11.4645C5.52678 12.4021 5 13.6739 5 15ZM6 9C6.39782 9 6.77936 8.84196 7.06066 8.56066C7.34196 8.27936 7.5 7.89782 7.5 7.5C7.5 7.10218 7.34196 6.72064 7.06066 6.43934C6.77936 6.15804 6.39782 6 6 6C5.60218 6 5.22064 6.15804 4.93934 6.43934C4.65804 6.72064 4.5 7.10218 4.5 7.5C4.5 7.89782 4.65804 8.27936 4.93934 8.56066C5.22064 8.84196 5.60218 9 6 9ZM14 9C14.3978 9 14.7794 8.84196 15.0607 8.56066C15.342 8.27936 15.5 7.89782 15.5 7.5C15.5 7.10218 15.342 6.72064 15.0607 6.43934C14.7794 6.15804 14.3978 6 14 6C13.6022 6 13.2206 6.15804 12.9393 6.43934C12.658 6.72064 12.5 7.10218 12.5 7.5C12.5 7.89782 12.658 8.27936 12.9393 8.56066C13.2206 8.84196 13.6022 9 14 9Z" fill="crimson"/>
</svg>
`;
                        break;
                    case "cleaning":
                        spanProfit.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 2C4.47 2 2 4.46 2 7.5V8H4V7.5C4 6.57174 4.36875 5.6815 5.02513 5.02513C5.6815 4.36875 6.57174 4 7.5 4C9 4 10.26 4.93 10.76 6.24C10.37 6.08 9.95 6 9.5 6C8.11 6 6.9 6.82 6.34 8L8.08 9C8.29 8.42 8.85 8 9.5 8C9.89782 8 10.2794 8.15804 10.5607 8.43934C10.842 8.72064 11 9.10218 11 9.5V11H13V9.5C13 9.10218 13.158 8.72064 13.4393 8.43934C13.7206 8.15804 14.1022 8 14.5 8C15.16 8 15.71 8.42 15.92 9L17.66 8C17.1 6.82 15.9 6 14.5 6C14.05 6 13.63 6.08 13.24 6.24C13.74 4.93 15 4 16.5 4C17.4283 4 18.3185 4.36875 18.9749 5.02513C19.6313 5.6815 20 6.57174 20 7.5V8H22V7.5C22 6.04131 21.4205 4.64236 20.3891 3.61091C19.3576 2.57946 17.9587 2 16.5 2C14.64 2 13 2.93 12 4.34C11 2.93 9.36 2 7.5 2ZM6 12V14H7.42C7.92 15.15 8.85 16.07 10 16.57V19H2C2 19 2.82 20.23 3.41 21.11C3.78 21.67 4.4 22 5.07 22H18.93C19.6 22 20.22 21.67 20.59 21.11L22 19H14V16.57C15.15 16.07 16.08 15.15 16.58 14H18V12H6Z" fill="${value > 0 ? "greenyellow":"crimson"}"/>
</svg>`;
                        break;
                    case "gold":
                        spanProfit.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.375 6.99766V6.5625C14.375 4.60313 11.4195 3.125 7.5 3.125C3.58047 3.125 0.625 4.60313 0.625 6.5625V9.6875C0.625 11.3195 2.67578 12.6164 5.625 13.0047V13.4375C5.625 15.3969 8.58047 16.875 12.5 16.875C16.4195 16.875 19.375 15.3969 19.375 13.4375V10.3125C19.375 8.69531 17.3891 7.39687 14.375 6.99766ZM4.375 11.4742C2.84453 11.0469 1.875 10.343 1.875 9.6875V8.58828C2.5125 9.03984 3.36641 9.40391 4.375 9.64844V11.4742ZM10.625 9.64844C11.6336 9.40391 12.4875 9.03984 13.125 8.58828V9.6875C13.125 10.343 12.1555 11.0469 10.625 11.4742V9.64844ZM9.375 15.2242C7.84453 14.7969 6.875 14.093 6.875 13.4375V13.1117C7.08047 13.1195 7.28828 13.125 7.5 13.125C7.80313 13.125 8.09922 13.1148 8.38984 13.0977C8.71271 13.2132 9.04157 13.3113 9.375 13.3914V15.2242ZM9.375 11.7383C8.75422 11.83 8.12751 11.8757 7.5 11.875C6.87249 11.8757 6.24578 11.83 5.625 11.7383V9.87969C6.24671 9.96064 6.87305 10.0008 7.5 10C8.12695 10.0008 8.75329 9.96064 9.375 9.87969V11.7383ZM14.375 15.4883C13.1316 15.6705 11.8684 15.6705 10.625 15.4883V13.625C11.2465 13.7085 11.8729 13.7503 12.5 13.75C13.127 13.7508 13.7533 13.7106 14.375 13.6297V15.4883ZM18.125 13.4375C18.125 14.093 17.1555 14.7969 15.625 15.2242V13.3984C16.6336 13.1539 17.4875 12.7898 18.125 12.3383V13.4375Z" fill="gold"/>
</svg>
`;
                        break;
                    case "population":
                        spanProfit.innerHTML += `<svg fill="#ffffff" width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <title>users-solid</title>
                                        <path class="clr-i-solid clr-i-solid-path-1" d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z">
                                        </path>
                                        <path class="clr-i-solid clr-i-solid-path-2" d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z">
                                        </path>
                                        <path class="clr-i-solid clr-i-solid-path-3" d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z">
                                        </path>
                                        <path class="clr-i-solid clr-i-solid-path-4" d="M24.43,13.44a6.54,6.54,0,0,1,0,.69,4.09,4.09,0,0,0,.58.05h.19A4.09,4.09,0,1,0,21.47,8,6.53,6.53,0,0,1,24.43,13.44Z">
                                        </path>
                                        <circle class="clr-i-solid clr-i-solid-path-5" cx="17.87" cy="13.45" r="4.47">
                                        </circle>
                                        <path class="clr-i-solid clr-i-solid-path-6" d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z">
                                        </path>
                                        <rect x="0" y="0" width="20" height="20" fill-opacity="0"></rect>
                                    </g>
                                </svg>`;
                        break;
                    case "iron":
                        spanProfit.innerHTML += `<svg fill="#cbcbcb" width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <title>gold-bar</title>
                                    <path d="M11.652 19.245l-0.001-0.001-0.005-0.003zM30.671 16.098l-2.207-5.839-8.022-4.361-16.624 8.861-2.431 6.495 9.8 5.214 0.161-7.067-7.624-4.353 0.654 0.346-0.373-0.215 1.332 0.708-1.212-0.708 7.526 4.065 16.205-8.376-2.594 1.424 3.037-1.551-6.011 3.183-10.434 5.727-0.668 6.816 19.484-10.371zM11.976 17.206l-4.389-2.342 4.269 1.32 13.070-5.8-12.95 6.822z">
                                    </path>
                                </svg>`;
                        break;
                    case "stone":
                        spanProfit.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#959595" d="M209.875 44.156l-182 106.47 119.625 54.31 148.344 11.72 41.97-24.312 17.342 11.562L309 230.656V379.53l53.563-14.624-64.625 51.97-110.875-59.626-2.157-1.53-71.28 6.56 75.936-31.967 100.75 52.125v-147.5l-145.906-11.5-1.625-.125-1.5-.688-121.093-55V391.47L44 423.186l82 20.97 21.875-21.282 11.156 29.72 131.282 33.592V434l4.25 2.28 5.47 2.94 4.812-3.908L309 431.97v52.155L491.375 377.78v-96.405L466.78 269.47l24.595-38.75V125l-90.25 52.28-1.094 34.095-88-58.688 84.97 5.375L476.5 112 291.562 64.937l1.625.563-64.406 5.78 5.345-20.936-24.25-6.188z"></path>
                                </svg>`;
                        break;

                    default:
                        break;
                }
                if (value < 0) {
                    spanProfit.classList.add("building-negative");
                    spanProfit.innerHTML += value;
                } else {
                    spanProfit.classList.add("building-positive");
                    spanProfit.innerHTML += "+" + value;
                }
                buildingProfitContent.appendChild(spanProfit);
            });
            const buildingCostContent = document.createElement("div");
            Object.entries(building.buildingCost).forEach(([key, value]) => {
                const spanCost = document.createElement("span");
                switch (key) {
                    case "wood":
                        spanCost.innerHTML = `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <style>
                                            .cls-1 {
                                                fill: #c47510;
                                                stroke: #93570b;
                                                stroke-miterlimit: 10;
                                                stroke-width: 1.88px;
                                            }
                                        </style>
                                    </defs>
                                    <circle class="cls-1" cx="6.82" cy="17.18" r="5.32"></circle>
                                    <circle class="cls-1" cx="6.82" cy="17.18" r="2.35"></circle>
                                    <path class="cls-1" d="M20.94,10.59,10.59,20.94a5.32,5.32,0,0,0-7.53-7.53L13.41,3.06a5.32,5.32,0,0,1,7.53,7.53Z"></path>
                                    <line class="cls-1" x1="9.35" y1="12.41" x2="12.79" y2="8.97"></line>
                                    <line class="cls-1" x1="21.94" y1="4.36" x2="18.18" y2="8.12"></line>
                                    <line class="cls-1" x1="13.73" y1="13.18" x2="17.06" y2="9.85"></line>
                                    <line class="cls-1" x1="15.76" y1="5.41" x2="19.06" y2="2.12"></line>
                                </svg>`;
                        break;
                    case "gold":
                        spanCost.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.375 6.99766V6.5625C14.375 4.60313 11.4195 3.125 7.5 3.125C3.58047 3.125 0.625 4.60313 0.625 6.5625V9.6875C0.625 11.3195 2.67578 12.6164 5.625 13.0047V13.4375C5.625 15.3969 8.58047 16.875 12.5 16.875C16.4195 16.875 19.375 15.3969 19.375 13.4375V10.3125C19.375 8.69531 17.3891 7.39687 14.375 6.99766ZM4.375 11.4742C2.84453 11.0469 1.875 10.343 1.875 9.6875V8.58828C2.5125 9.03984 3.36641 9.40391 4.375 9.64844V11.4742ZM10.625 9.64844C11.6336 9.40391 12.4875 9.03984 13.125 8.58828V9.6875C13.125 10.343 12.1555 11.0469 10.625 11.4742V9.64844ZM9.375 15.2242C7.84453 14.7969 6.875 14.093 6.875 13.4375V13.1117C7.08047 13.1195 7.28828 13.125 7.5 13.125C7.80313 13.125 8.09922 13.1148 8.38984 13.0977C8.71271 13.2132 9.04157 13.3113 9.375 13.3914V15.2242ZM9.375 11.7383C8.75422 11.83 8.12751 11.8757 7.5 11.875C6.87249 11.8757 6.24578 11.83 5.625 11.7383V9.87969C6.24671 9.96064 6.87305 10.0008 7.5 10C8.12695 10.0008 8.75329 9.96064 9.375 9.87969V11.7383ZM14.375 15.4883C13.1316 15.6705 11.8684 15.6705 10.625 15.4883V13.625C11.2465 13.7085 11.8729 13.7503 12.5 13.75C13.127 13.7508 13.7533 13.7106 14.375 13.6297V15.4883ZM18.125 13.4375C18.125 14.093 17.1555 14.7969 15.625 15.2242V13.3984C16.6336 13.1539 17.4875 12.7898 18.125 12.3383V13.4375Z" fill="gold"/>
                        </svg>`;
                        break;
                    case "iron":
                        spanCost.innerHTML += `<svg fill="#cbcbcb" width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <title>gold-bar</title>
                                    <path d="M11.652 19.245l-0.001-0.001-0.005-0.003zM30.671 16.098l-2.207-5.839-8.022-4.361-16.624 8.861-2.431 6.495 9.8 5.214 0.161-7.067-7.624-4.353 0.654 0.346-0.373-0.215 1.332 0.708-1.212-0.708 7.526 4.065 16.205-8.376-2.594 1.424 3.037-1.551-6.011 3.183-10.434 5.727-0.668 6.816 19.484-10.371zM11.976 17.206l-4.389-2.342 4.269 1.32 13.070-5.8-12.95 6.822z">
                                    </path>
                                </svg>`;
                        break;
                    case "stone":
                        spanCost.innerHTML += `<svg width="${buildingIconSize}" height="${buildingIconSize}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#959595" d="M209.875 44.156l-182 106.47 119.625 54.31 148.344 11.72 41.97-24.312 17.342 11.562L309 230.656V379.53l53.563-14.624-64.625 51.97-110.875-59.626-2.157-1.53-71.28 6.56 75.936-31.967 100.75 52.125v-147.5l-145.906-11.5-1.625-.125-1.5-.688-121.093-55V391.47L44 423.186l82 20.97 21.875-21.282 11.156 29.72 131.282 33.592V434l4.25 2.28 5.47 2.94 4.812-3.908L309 431.97v52.155L491.375 377.78v-96.405L466.78 269.47l24.595-38.75V125l-90.25 52.28-1.094 34.095-88-58.688 84.97 5.375L476.5 112 291.562 64.937l1.625.563-64.406 5.78 5.345-20.936-24.25-6.188z"></path>
                                </svg>`;
                        break;

                    default:
                        break;
                }
                if (value < 0) {
                    spanCost.classList.add("building-negative");
                    spanCost.innerHTML += value;
                } else {
                    spanCost.classList.add("building-positive");
                    spanCost.innerHTML += "+" + value;
                }
                buildingCostContent.appendChild(spanCost);
            });
            const buildCard = `<div class="building-card">
                            <div class="building-img">
                                <img src="${building.buildingImage}" alt="">
                            </div>    
                            <span class="building-name">${building.buildingName}</span>                    
                            <div style="display:flex; flex-direction: row; justify-content: center;padding:2px">                          
                                <svg width="10" height="16" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.60312e-10 2C6.60312e-10 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H12C12.5304 0 13.0391 0.210714 13.4142 0.585786C13.7893 0.960859 14 1.46957 14 2V3.86C13.9999 4.68314 13.7966 5.49353 13.4081 6.21923C13.0196 6.94493 12.458 7.56349 11.773 8.02L8.803 10L11.773 11.98C12.458 12.4365 13.0196 13.0551 13.4081 13.7808C13.7966 14.5065 13.9999 15.3169 14 16.14V18C14 18.5304 13.7893 19.0391 13.4142 19.4142C13.0391 19.7893 12.5304 20 12 20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 6.60313e-10 18.5304 6.60312e-10 18V16.14C-1.3374e-05 15.3169 0.203152 14.5066 0.591466 13.7809C0.979781 13.0552 1.54123 12.4366 2.226 11.98L5.198 10L2.228 8.02C1.54286 7.5636 0.981019 6.94509 0.592348 6.21939C0.203677 5.49368 0.000206112 4.68323 6.60312e-10 3.86V2ZM7 8.798L10.664 6.355C11.0748 6.08116 11.4117 5.71018 11.6447 5.27495C11.8778 4.83972 11.9998 4.3537 12 3.86V2H2V3.86C2.0002 4.3537 2.12224 4.83972 2.35529 5.27495C2.58834 5.71018 2.92521 6.08116 3.336 6.355L7 8.798ZM7 11.202L3.336 13.645C2.92521 13.9188 2.58834 14.2898 2.35529 14.7251C2.12224 15.1603 2.0002 15.6463 2 16.14V18H12V16.14C11.9998 15.6463 11.8778 15.1603 11.6447 14.7251C11.4117 14.2898 11.0748 13.9188 10.664 13.645L7 11.202Z" fill="gold"/>
                                </svg>
                                <span class="building-name">${building.buildingBuildTime} DK</span>
                            </div>
                            <span class="building-definition">${building.buildingDefinition}</span>

                            <div class="building-profit">
                                <span class="content-title">Getirisi</span>
                                <div class="building-profit-content">
                                    ${buildingProfitContent.innerHTML}
                                </div>
                            </div>
                            <div class="building-cost"> 
                                <span class="content-title">Yapım Maliyeti</span>
                                <div class="building-cost-content">
                                    ${buildingCostContent.innerHTML}
                                </div>         
                            </div>
                            <button class="build-add" id="building-${building.buildingId}">İNŞA ET</button>
                        </div`;
            const newBuildCard = document.createElement("div");
            newBuildCard.innerHTML = buildCard;
            gameSoundControl.setGameBtnClickEffect(newBuildCard);
            buildContent.appendChild(newBuildCard);
            // Buildind Add butona tıklanınca yapılan işlemler.
            const buildAddBtn = buildContent.querySelector(`#building-${building.buildingId}`);
            buildAddBtn.addEventListener("click", () => {
                const condition = game.selectedCity.cityBuildings.find(cityBuilding => cityBuilding === building);
                if (condition === false || condition === undefined) {
                    game.gameActions.makeBuilding(game.selectedCity, building);
                    this.getCityBuildingsInfo(game.selectedCity.cityBuildings);
                } else {
                    if (!document.querySelector(".game-alert")) {
                        this.showGameAlert(`Bu <span class="yellow bold">${building.buildingName}</span> yapısı zaten bu şehirde var!`, 2000);
                    }
                }

            });

        });
        setTimeout(() => {
            this.allGameUIList.BuildingModal.style.setProperty("top", "50%");
        }, 100);

    };
    showGameAlert(alertText, countDown) {
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("game-alert");
        const alertTextSpan = document.createElement("span");
        alertTextSpan.innerHTML = alertText;
        alertDiv.appendChild(alertTextSpan);
        const gameContent = document.querySelector(".game-content");
        gameContent.appendChild(alertDiv);
        if (countDown) {
            setTimeout(() => {
                alertDiv.remove();
            }, countDown);
        }
    };
    deletGameAlert() {
        const gameAlert = document.querySelector(".game-alert");
        gameAlert.remove();
    }
    addEventGameAllActionLogBar(logEvent) {
        const gameAllActionLongBar = document.getElementById("game-all-action-log-bar");
        const spanEvent = document.createElement("span");
        spanEvent.innerHTML = logEvent;
        const logContent = gameAllActionLongBar.querySelector(".log-content");
        logContent.appendChild(spanEvent);
        logContent.scrollTop = logContent.scrollHeight;
    };
}
class Building {
    constructor(
        buildingId,
        buildingName,
        buildingImage,
        buildingLevel,
        buildingType,
        buildingProfit,
        buildingDefinition,
        buildingCondition,
        buildingCraftMaterial,
        buildingCost,
        buildingBuildTime
    ) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.buildingImage = buildingImage;
        this.buildingLevel = buildingLevel;
        this.buildingType = buildingType;
        this.buildingProfit = buildingProfit;
        this.buildingDefinition = buildingDefinition;
        this.buildingCondition = buildingCondition;
        this.buildingCraftMaterial = buildingCraftMaterial;
        this.buildingCost = buildingCost;
        this.buildingBuildTime = buildingBuildTime;
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
    _uiControl = new UIControl();
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
        this.selectedCity = new City();
        this.selectedCountry = new Country();
    }
    async getBuildingData(path, buildingArray) {
        try {
            const response = await fetch(path);
            const buildings = await response.json();
            buildings.forEach(building => {
                buildingArray.push(
                    new Building(building.buildingId, building.buildingName, building.buildingImage, building.buildingLevel, building.buildingType, building.buildingProfit, building.buildingDefinition, building.buildingCondition, building.buildingCraftMaterial, building.buildingCost, building.buildingBuildTime)
                );
            });

        } catch (error) {
            console.error('Building verisi alınırken hata oluştu:', error);
            this._uiControl.showGameAlert("Building verisi alınırken hata oluştu!", 4000);
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
            this._uiControl.showGameAlert("Ülke verisi alınırken hata oluştu!", 4000);
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
            this._uiControl.showGameAlert("Oyuncu verisi alınırken hata oluştu!", 4000);
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
            this._uiControl.showGameAlert("Şehir verisi alınırken hata oluştu!", 4000);
        }
    };
    /*async writeConcoleAllPlayerInfo(player) {
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
    }*/
    async start() {
        document.body.addEventListener("click", (e) => {
            this.footerInfoPanelClose(e);
            this.buildingModalClose(e);

        });

        const footerCloseBtn = document.getElementById("close-footer-panel-btn");
        footerCloseBtn.addEventListener("click", () => {
            const _uiControl = new UIControl();
            _uiControl.allGameUIList.GameFootherBar.style.top = "-50%";
            setTimeout(() => {
                _uiControl.hideUI(_uiControl.allGameUIList.GameFootherBar);
            }, 300);

        });

        const buildingModalCloseBtn = document.getElementById("close-building-modal-btn");
        buildingModalCloseBtn.addEventListener("click", () => {
            const _uiControl = new UIControl();
            _uiControl.allGameUIList.BuildingModal.style.top = "-50%";
            setTimeout(() => {
                _uiControl.hideUI(_uiControl.allGameUIList.BuildingModal);
            }, 300);
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
        this._uiControl.showGameAlert(`<span class="dark-orange bold">Oyun duraktıldı...</span>`);
        this._uiControl.addEventGameAllActionLogBar(`<span class="dark-orange bold">Oyun duraktıldı...</span>`);
        this.selectedCountry = this.countryArray[3];
        this.setCountryDataToUI(this.selectedCountry);
        this.setCounrtyChangeBar(this.playerArray);
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
                    console.log("Oyun bitti.");
                    this._uiControl.showGameAlert(`<span class="dark-red bold">Oyun Bitti</span>`);
                    this._uiControl.addEventGameAllActionLogBar(`<span class="dark-red bold">Oyun Bitti</span>`);
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
            console.log("Oyun duraktıldı...");
            this._uiControl.showGameAlert(`<span class="dark-orange bold">Oyun duraktıldı...</span>`);
            this._uiControl.addEventGameAllActionLogBar(`<span class="dark-orange bold">Oyun duraktıldı...</span>`);
        }
    };
    gameLoopPlay() {
        if (!this._loopSituation) {
            const playGameBtn = document.getElementById("play-game-btn");
            playGameBtn.style.display = "none";
            const pauseGameBtn = document.getElementById("pause-game-btn");
            pauseGameBtn.style.display = "flex";
            this._loopSituation = true;
            if (document.querySelector(".game-alert"))
                this._uiControl.deletGameAlert();
            console.log("Oyun devam ediyor...");
            this._uiControl.showGameAlert(`<span class="yellow bold">Oyun devam ediyor...</span>`, 2000);
            this._uiControl.addEventGameAllActionLogBar(`<span class="yellow bold">Oyun devam ediyor...</span>`);
        }
    };

    gameLoopTimeSpeedHalf() {
        this._gameLoopTimeSpeed = 2000;
        this.gameloopFinish();
        this.gameLoopStart(this._gameLoopTime, 5);
        this._uiControl.showGameAlert(`<span class="yellow bold">Oyun hızı yavaşlatıldı.</span>`, 2000);
        this._uiControl.addEventGameAllActionLogBar(`<span class="yellow bold">Oyun hızı yavaşlatıldı.</span>`);
    };
    gameLoopTimeSpeedNormal() {
        this._gameLoopTimeSpeed = 1000;
        this.gameloopFinish();
        this.gameLoopStart(this._gameLoopTime, 5);
        this._uiControl.showGameAlert(`<span class="yellow bold">Oyun hızı normal hıza alındı.</span>`, 2000);
        this._uiControl.addEventGameAllActionLogBar(`<span class="yellow bold">Oyun hızı normal hıza alındı.</span>`);
    };
    gameLoopTimeSpeedDouble() {
        this._gameLoopTimeSpeed = 500;
        this.gameloopFinish();
        this.gameLoopStart(this._gameLoopTime, 5);
        this._uiControl.showGameAlert(`<span class="yellow bold">Oyun hızı hızlandırıldı.</span>`, 2000);
        this._uiControl.addEventGameAllActionLogBar(`<span class="yellow bold">Oyun hızı hızlandırıldı.</span>`);
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
            _uiControl.allGameUIList.BuildingModal,
            _uiControl.allGameUIList.PlayerCountryFlag
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
            _uiControl.allGameUIList.GameFootherBar.style.top = "-50%";
            setTimeout(() => {
                _uiControl.hideUI(_uiControl.allGameUIList.GameFootherBar);
            }, 300);

        }
    };
    buildingModalClose(e) {
        const _uiControl = new UIControl();
        const excludedElements = [
            _uiControl.allGameUIList.GameFootherBar,
            _uiControl.allGameUIList.PlayerCountryInfoBar,
            _uiControl.allGameUIList.GameTimeBar,
            _uiControl.allGameUIList.BuildingModal,
            _uiControl.allGameUIList.PlayerCountryFlag
        ];
        const clickedInsideExcluded = excludedElements.some((el) => el && el.contains(e.target));

        if (!clickedInsideExcluded) {
            _uiControl.allGameUIList.BuildingModal.style.top = "-50%";
            setTimeout(() => {
                _uiControl.hideUI(_uiControl.allGameUIList.BuildingModal);
            }, 300);
        }
    };
    setCountryDataToUI(country) {
        //Ülke ismi
        const playerCountryName = document.getElementById("player-country-name");
        playerCountryName.textContent = country.countryName;
        //Ülke Bayrağı
        const playerCountryFlag = document.getElementById("player-country-flag");
        const playerCountryFlagBackground = playerCountryFlag.querySelector("svg");
        playerCountryFlagBackground.style.fill = country.countryFlag.countryFlagBackgroundColor;
        const playerCountryFlagSymbol = playerCountryFlag.querySelector("path");
        playerCountryFlagSymbol.setAttribute("d", country.countryFlag.countryFlagSymbol);
        playerCountryFlagSymbol.style.fill = country.countryFlag.countryFlagSymbolColor;
        //Kaynak verisi 
        const resourceFood = document.querySelector(".resource-food");
        const resourceWood = document.querySelector(".resource-wood");
        const resourceStone = document.querySelector(".resource-stone");
        const resourceIron = document.querySelector(".resource-iron");
        const resourceGold = document.querySelector(".resource-gold");
        const resourcePeople = document.querySelector(".resource-people");
        resourceFood.textContent = country.countryResource[0].food;
        resourceWood.textContent = country.countryResource[0].wood;
        resourceStone.textContent = country.countryResource[0].stone;
        resourceIron.textContent = country.countryResource[0].iron;
        resourceGold.textContent = country.countryResource[0].gold;

    };
    setCounrtyChangeBar(playerArray) {
        const countryChangeMenu = document.getElementById("country-change-menu");
        const buttonsDiv = countryChangeMenu.querySelector("#buttons");
        playerArray.forEach(player => {
            const countryButton = document.createElement("button");
            countryButton.innerHTML = this.createCountyChangeButton(player);
            countryButton.addEventListener("click", () => {
                this.setCountryDataToUI(player.playerCountry);
                this.selectedCountry = player.playerCountry;
            });
            gameSoundControl.setGameBtnClickEffect(countryButton);
            buttonsDiv.appendChild(countryButton);
        });

    };
    createCountyChangeButton(player) {
        const button = `<button class="country">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" style="background-color:${player.playerCountry.countryFlag.countryFlagBackgroundColor}" >
                                    <g id="katman_2" data-name="katman 2">
                                        <g id="">
                                            <g transform="translate(6, 0) scale(1,1)" >
                                                <path id="player-country-flag-sembol"
                                                    d="${player.playerCountry.countryFlag.countryFlagSymbol}" fill="${player.playerCountry.countryFlag.countryFlagSymbolColor}"> 
                                                </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <span>${player.playerCountry.countryName} (${player.playerName})</span>
                            </div>
                        </button>`;
        return button;
    }

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
        const _uiControl = new UIControl();
        _uiControl.addEventGameAllActionLogBar(`<span class="yellow bold">${building.buildingName}</span> yapısı <span class="light-green bold">${selectedCity.cityName}</span> şehrine eklendi.`);
        selectedCity.cityBuildings.push(building);
    }
}

class GameSoundControl {
    constructor(
        gameAllSoundMute,
        gameStartChampaignSound,
        gameMainMusicSound,
        gameBtnClickEffectSound,

    ) {
        this.gameAllSoundMute = gameAllSoundMute;
        this.gameStartChampaignSound = new Audio(gameStartChampaignSound);
        this.gameMainMusicSound = new Audio(gameMainMusicSound);
        this.gameBtnClickEffectSound = new Audio(gameBtnClickEffectSound);
    };
    playSound(gameSound, gameSoundVolume, gameSoundLoop) {
        gameSound.loop = gameSoundLoop;
        if (!gameSoundVolume)
            gameSound.volume = _gameSoundVolume;
        gameSound.play();
    };
    pauseSound(gameSound) {
        gameSound.pause();
    };
    setCurrentTimeSoundZero(gameSound) {
        gameSound.currentTime = 0;
    };
    setGameBtnClickEffect(gameBtnObject) {
        gameBtnObject.addEventListener('mouseover', () => {
            if (!this.gameAllSoundMute)
                this.playSound(this.gameBtnClickEffectSound, 1);
        })
        gameBtnObject.addEventListener('mouseout', () => {
            if (!this.gameAllSoundMute) {
                this.pauseSound(this.gameBtnClickEffectSound);
                this.setCurrentTimeSoundZero(this.gameBtnClickEffectSound);
            }
        })
    };
}

const game = new Game();
// Varsayılan oyun içi ses seviyesi.
const _gameSoundVolume = 0.5;
const gameSoundControl = new GameSoundControl(true, "sounds/game-start-sound.mp3", "sounds/main_music.mp3", "sounds/effect-Sound1.mp3");

const newGameBtn = document.getElementById("new-game-btn");
const mainSoundControlBtn = document.getElementById("main-sound-btn");
const gameMenuBtns = document.querySelectorAll(".game-btn-sound");

newGameBtn.addEventListener("click", () => {
    game.start();
    game.showGameBarPanel();
    if (!gameSoundControl.gameAllSoundMute) {
        gameSoundControl.playSound(gameSoundControl.gameStartChampaignSound);
        gameSoundControl.pauseSound(gameSoundControl.gameMainMusicSound);
    }
});

let mainSoundSituation = false;

mainSoundControlBtn.addEventListener("click", () => {
    if (!mainSoundSituation) {
        if (gameSoundControl.gameAllSoundMute)
            mainSoundPlay();
        mainSoundSituation = true;
    } else {
        if (!gameSoundControl.gameAllSoundMute)
            mainSoundPause();
        mainSoundSituation = false;
    }
});

function mainSoundPlay() {
    gameSoundControl.playSound(gameSoundControl.gameMainMusicSound, _gameSoundVolume, true);
    gameSoundControl.gameAllSoundMute = false;

    const mainSoundControlBtnOffIcon = document.getElementById("main-sound-off");
    mainSoundControlBtnOffIcon.style.display = "none";
    const mainSoundControlBtnOnIcon = document.getElementById("main-sound-on");
    mainSoundControlBtnOnIcon.style.display = "inline";
}

function mainSoundPause() {
    gameSoundControl.pauseSound(gameSoundControl.gameMainMusicSound);
    gameSoundControl.gameAllSoundMute = true;

    const mainSoundControlBtnOffIcon = document.getElementById("main-sound-off");
    mainSoundControlBtnOffIcon.style.display = "inline";
    const mainSoundControlBtnOnIcon = document.getElementById("main-sound-on");
    mainSoundControlBtnOnIcon.style.display = "none";
}

gameMenuBtns.forEach(btn => {
    gameSoundControl.setGameBtnClickEffect(btn);
})

//Oyun Hızı işlemleri.
const pauseGameBtn = document.getElementById("pause-game-btn");
const playGameBtn = document.getElementById("play-game-btn");
const timeSpeedHalf = document.getElementById("time-speed-half-btn");
const timeSpeedNormal = document.getElementById("time-speed-normal-btn");
const timeSpeedDouble = document.getElementById("time-speed-double-btn");

pauseGameBtn.addEventListener("click", () => {
    game.gameLoopPause();
});
playGameBtn.addEventListener("click", () => {
    game.gameLoopPlay();
});

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