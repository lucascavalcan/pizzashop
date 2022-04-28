let cart = []; 
let modalQt =  1;
let modalKey = 0; 

const c = (elemento) => document.querySelector(elemento);
const cs = (elemento) => document.querySelectorAll(elemento)


/* LISTAGEM DAS PIZZAS */
pizzaJson.map( (item, index)=>{
    // preencher as informações em pizza-item
    let pizzaItem = c(".models .pizza-item").cloneNode(true);

    pizzaItem.setAttribute("data-key", index); 
    

    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    pizzaItem.querySelector("a").addEventListener("click", (evento)=>{
        evento.preventDefault();

        let key = evento.target.closest(".pizza-item").getAttribute("data-key");

        modalQt = 1;
        modalKey = key; 

        /* PREENCHENDO MODAL: */
        c(".pizzaBig img").src = pizzaJson[key].img;
        c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c(".pizzaInfo--size.selected").classList.remove("selected");
        cs(".pizzaInfo--size").forEach( (size, sizeIndex)=>{
            if(sizeIndex == 2) {  /* marcar como selecionado a opção "grande" dos tamanhos*/
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        } );

        /* ABRINDO MODAL: */
        c(".pizzaInfo--qt").innerHTML = modalQt;

        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = "flex";
        setTimeout( ()=> {
            c(".pizzaWindowArea").style.opacity = 1;
        }, 200 );
    })

    // adicionar na tela (dentro da div class="pizza-area")
    c(".pizza-area").append( pizzaItem );
} )

/* EVENTOS DO MODAL: */
/* FECHAR O MODAL */
function closeModal(){
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout( ()=>{
        c(".pizzaWindowArea").style.display = "none";
    }, 500);
};

cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach( (item)=> {
    item.addEventListener("click", closeModal);
});

/* BOTÃO DE MENOS E MAIS (AUMENTAR E DIMINUIR A QUANTIDADE DE PIZZAS)*/
c(".pizzaInfo--qtmais").addEventListener("click", ()=>{
    modalQt++;
    c(".pizzaInfo--qt").innerHTML = modalQt;  // atualizando o valor de pizzaInfo--qt
});
c(".pizzaInfo--qtmenos").addEventListener("click", ()=>{
    if (modalQt > 1) {
        modalQt--;
        c(".pizzaInfo--qt").innerHTML = modalQt;
    };
});

/* MODIFICAR O TAMANHO */
cs(".pizzaInfo--size").forEach( (size, sizeIndex)=>{
    size.addEventListener("click", ()=>{
        c(".pizzaInfo--size.selected").classList.remove("selected"); /* remove todos que estiverem selecionados */
        size.classList.add("selected");
    });
} );

/* ADICIONAR AO CARRINHO */
c(".pizzaInfo--addButton").addEventListener("click", ()=>{
    
    let size =  parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key")); 
    
    let identifier = pizzaJson[modalKey].id+"@"+size;
    
    let key = cart.findIndex( (item)=>item.identifier == identifier);
    //se ele encontrar, ele retorna o index desse item, se não, ele retorna -1. Ou seja:
    if (key > -1) { 
        cart[key].qt += modalQt; 
    } else {  
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,  
            size:size,
            qt:modalQt
        });
    }

    closeModal();  
    updateCart();
} );


/* MOSTRAR O CARRINHO NO MOBILE */
c(".menu-openner").addEventListener("click", ()=> {
    if (cart.length > 0) { 
        c("aside").style.left = "0"; 
    }
});
/* FECHAR O CARRINHO NO MOBILE */
c(".menu-closer").addEventListener("click", ()=>{
    c("aside").style.left = "100vw";
});

/* MOSTRAR O CARRINHO */
function updateCart() {

    //mobile
    c(".menu-openner span").innerHTML = cart.length;

    if (cart.length > 0) {  //verificando se tem algum item no carrinho
        c("aside").classList.add("show");
        c(".cart").innerHTML = "";

        let subtotal = 0;  
        let total = 0;
        let desconto = 0;

        for (let i in cart) {  
            let pizzaItem = pizzaJson.find( (item)=> item.id == cart[i].id);
            
            subtotal += pizzaItem.price * cart[i].qt; 
            
            let cartItem = c(".models .cart--item").cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1:
                    pizzaSizeName = "M";
                    break;
                case 2:
                    pizzaSizeName = "G";
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //preenchendo as informações:
            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName; //concatenar o nome e o tamanho
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

            //botões de + e -
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", ()=>{
                cart[i].qt++;
                updateCart(); 
            });
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                if (cart[i].qt > 1) {  
                    cart[i].qt--;
                } else {  
                    cart.splice(i, 1);
                }
                updateCart();
            });

            c(".cart").append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        //exibir o total, subtotal e desconto
        c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c("aside").classList.remove("show");
        c("aside").style.left = "100vw";  
    }
};
