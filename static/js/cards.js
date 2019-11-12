let cards = document.getElementsByClassName("card-content");
for(let i=0; i<cards.length; i++){
    let card = cards[i]
    if(card.parentNode && card.parentNode.tagName === 'LI'){
        let parent = card.parentNode;
        parent.style= "cursor: pointer;"
        // TODO: This isn't the right way to handle this
        // But I don't want to pull in jquery just to hide
        // and show elements.
        parent.onclick = (event) => {
            if(card.isCardOpen){
                card.isCardOpen = false;
                card.style="display:none;"
            }
            else {
                card.isCardOpen = true;
                card.style="display:block;"
            }
        }

    }
}
