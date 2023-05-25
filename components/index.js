let currentBox2;
let currentBox3;
let selectionBox2 = document.querySelectorAll('.selection2');
let selectionBox3 = document.querySelectorAll('.selection3');
let detailsBox = document.querySelector('.details');
let selectionRightBox = document.querySelector('.selectionRight');
let messageBox = document.querySelector('.message');
let priceBox = document.querySelector('.price span');
let surface = document.querySelectorAll('[name="surface"]');
let painting = document.querySelectorAll('[name="painting"]');
let roundedCorners = document.querySelector('#roundedCorners');
let chamfer = document.querySelector('#chamfer');
let finalOrderTable = document.querySelector('.finalOrderTable');
let finalOrderTableNone = document.querySelector('.finalOrderTableNone');
let finalOrderBox = document.querySelector('.finalOrderBox');
let openOrder = document.querySelector('.openOrder');
let closeOrder = document.querySelector('.closeOrder');
let currentId;
let currentPrice;
let currentPriceFinal
let currentColor;
let currentImg;
let currentName;
let currentSurface;
let currentPainting;
let currentRoundedCorners;
let currentChamfer;


document.querySelector('.selectionLeft').addEventListener('change', function(event) {
    let currentBox = event.target.parentElement.className;
    let currentValue = event.target.value;
    if (currentBox === "selection1") {
        selectionBox2.forEach(item => {
            item.classList.add('none');
            item.firstChild.selectedIndex = 0;
        });
        selectionBox3.forEach(item => {
            item.classList.add('none');
            item.firstChild.selectedIndex = 0;
        });
        let newBox = `${currentValue}`;
        document.querySelector('#'+`${newBox}`).classList.remove('none');
        currentBox2 = currentValue;
        detailsBox.innerHTML = '';
        detailsBox.classList.add('none');
        selectionRightBox.classList.add('none');
        messageBox.innerHTML = `<div class="message3">Отлично!</div><div class="message2">← <span>Выбери разновидность</span></div>`;
    } 
    else if (currentBox === "selection2") {
        selectionBox3.forEach(item => {
            item.classList.add('none');
        });
        let newBox = `${currentBox2}` + `${currentValue}`;
        document.querySelector('#'+`${newBox}`).classList.remove('none');
        currentBox3 = currentValue;
        detailsBox.innerHTML = '';
        detailsBox.classList.add('none');
        selectionRightBox.classList.add('none');
        messageBox.innerHTML = `<div class="message3">Прекрасно!</div><div class="message4">И на последок</div><div class="message2">← <span>Выбери цвет</span></div>`;
    }
    else if (currentBox === "selection3") {
        let newBox = `${currentBox2}` + `${currentBox3}` + `${currentValue}`;
        CATALOG.forEach(({ id, price, img , name, color}) => {
            if (newBox === id) {
                surface[0].checked = true;
                painting[0].checked = true;
                roundedCorners.checked = false;
                chamfer.checked = false;
                detailsBox.classList.remove('none');
                selectionRightBox.classList.remove('none');
                messageBox.classList.add('none');
                detailsBox.innerHTML = 
                    `<img src="${img}" alt="${name}" tabindex="0">
                    <img src="${img}" alt="${name}" tabindex="0">
                    <img src="${img}" alt="${name}" tabindex="0">
                    <img src="${img}" alt="${name}" tabindex="0">`
                ; 
            currentId = newBox;
            currentImg = img;
            currentColor = color;
            currentPrice = price;
            currentPriceFinal = price;
            currentName = name;
            priceBox.innerHTML = price;
            currentSurface = '1';
            currentPainting = '1';
            currentRoundedCorners = '0';
            currentChamfer = '0';
            };  
        });  
    };
});


function selectionRightChange() {
    let surfacePrice;
    let paintingePrice;
    surface.forEach(item => {
        if (item.checked) {
            surfacePrice = item.value;
            currentSurface = item.dataset.choice;
        }; 
    });
    painting.forEach(item => {
        if (item.checked) {
            paintingePrice = item.value;
            currentPainting = item.dataset.choice;
        }; 
    });
        if (roundedCorners.checked) {
            roundedCorners.value = 50;
            currentRoundedCorners = '1';
        }   else {
            roundedCorners.value = 0;
            currentRoundedCorners = '0';
        };
        if (chamfer.checked) {
            chamfer.value = 100;
            currentChamfer = '1';
        }   else {
            chamfer.value = 0;
            currentChamfer = '0';
        };
        currentPriceFinal = Math.floor((Number(currentPrice) + Number(roundedCorners.value) + Number(chamfer.value)) * Number(surfacePrice) * Number(paintingePrice));
        priceBox.innerHTML = currentPriceFinal;
};


function addTolocalStorage() {
        let orderKey = currentId + currentSurface + currentPainting + currentRoundedCorners + currentChamfer;
        let orderObject = {
            price: currentPriceFinal,
            img: currentImg,
            color: currentColor,
            name: currentName,
            quantity: 1,
        };
        if (localStorage.getItem(`${orderKey}`) === null) {
            localStorage.setItem(`${orderKey}`, JSON.stringify(orderObject));
        };
        ShoppingRender();
};


function getItemQuantity(key) {
    let keyValue = JSON.parse(localStorage.getItem(key));
    return keyValue.quantity;
};
function minusImagesF(key) {
    let quantity = getItemQuantity(key);
     if (quantity > 1) {
        return 'images/minus.jpg';
    } else {
        return 'images/noMinus.jpg';
    };
};
function minusPointerF(key) {
    let quantity = getItemQuantity(key);
    if (quantity > 1) {
        return 'big-quantity';
     } else {
        return '';
    };
};
function minusItem(key) {
    let keyValue = JSON.parse(localStorage.getItem(key));
    if (keyValue.quantity > 1) {
        keyValue.quantity--;
        localStorage.setItem(`${key}`, JSON.stringify(keyValue));
        ShoppingRender(); 
    };
};
function plusItem(key) {
    let keyValue = JSON.parse(localStorage.getItem(key));
    keyValue.quantity++;
    localStorage.setItem(`${key}`, JSON.stringify(keyValue));
    ShoppingRender();
};
function deleteItem(key) {
    localStorage.removeItem(`${key}`);
    ShoppingRender();
};
function deleteAll(event) {
    localStorage.clear();
    ShoppingRender();
};


ShoppingRender();
function ShoppingRender(){
    if (localStorage.length < 1) {
        finalOrderTable.classList.add('none');
        finalOrderTableNone.classList.remove('none');
    } else {
        finalOrderTableNone.classList.add('none');
        finalOrderTable.classList.remove('none');
        let htmlElem = '';
        let serialNumber = 0;
        let quantityPrice = 0;
        let sumPrice = 0;

        for(let i=0; i<localStorage.length; i++) {
            let key = localStorage.key(i);
            let keyValue = JSON.parse(localStorage.getItem(key));
            let keySurface;
            let keyPainting;
            let keyRoundedCorners;
            let keyChamfer;
            if (key.split('')[3] == 1) {
                keySurface = 'Глянцевая поверхность';
            };
            if (key.split('')[3] == 2) {
                keySurface = 'Матовая поверхность';
            };
            if (key.split('')[4] == 1) {
                keyPainting = ', краска с одной стороны';
            };
            if (key.split('')[4] == 2) {
                keyPainting = ', краска с двух сторон';
            };
            if (key.split('')[5] == 0) {
                keyRoundedCorners = '';
            };
            if (key.split('')[5] == 1) {
                keyRoundedCorners = ', скругленные углы';
            };
            if (key.split('')[6] == 0) {
                keyChamfer = '';
            };
            if (key.split('')[6] == 1) {
                keyChamfer = ', скошенная кромка';
            };

            
            serialNumber ++;
            quantityPrice = keyValue.quantity * keyValue.price;
            let minusImages = minusImagesF(key);
            let minusPointer = minusPointerF(key);
            htmlElem += `
                    <tr>
                        <td class="shopping-element__serialNumber">${serialNumber}.</td>
                        <td class="shopping-element__img"><img src="${keyValue.img}" width="30" height="30" alt="${keyValue.name}"></td>
                        <td class="shopping-element__name">${keyValue.color} ${keyValue.name} <span class="shopping-element__data"> (${keySurface}${keyPainting}${keyRoundedCorners}${keyChamfer}) </span></td>
                        <td class="shopping-element__price textEnd">${quantityPrice.toLocaleString()} USD</td>
                        <td class="shopping-element__quantity"><img class="${minusPointer}" src="${minusImages}" width="20" height="20" alt="minusItem" onclick="minusItem('${key}');"> ${keyValue.quantity} <img class="big-quantity" src="images/plus.jpg" width="20" height="20" alt="plusItem" onclick="plusItem('${key}');"></td>
                        <td class="shopping-element__delete"><img src="images/delete.jpg" width="20" height="20" alt="deleteItem" onclick="deleteItem('${key}');"></td>
                    </tr>
                `;
            sumPrice += quantityPrice;    
        };
        let html = `
            <div class="shopping-container">
                <div class="shopping__close" onclick="shoppingClear();"></div>
                <table>
                    ${htmlElem}
                    <tr>
                        <td></td>
                        <td></td>
                        <td class="shopping-element__name textEnd">Сумма:</td>
                        <td class="shopping-element__price textEnd">${sumPrice.toLocaleString()} USD</td>
                        <td></td>
                    </tr>
                </table>
                <input type="button" class="deleteAll" value="Удалить все товары" onclick="deleteAll()">
                <input type="button" class="print" value="Распечатать" onclick="window.print()">
            </div>
        `;
        finalOrderTable.innerHTML = html; 
    };     
};


function openOrderF(event) {
    finalOrderBox.classList.add('extension');
    openOrder.classList.add('none');
    closeOrder.classList.remove('none');
    finalOrderBox.classList.remove('notExtension');
    // event.stopPropagation();
};
function closeOrderF(event) {
    finalOrderBox.classList.remove('extension');
    closeOrder.classList.add('none');
    openOrder.classList.remove('none');
    finalOrderBox.classList.add('notExtension');
    // event.stopPropagation();
};
