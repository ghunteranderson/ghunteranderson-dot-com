// Attach toggle listener to any mini cards
$(document).ready(() => {
    $('ul.card,ol.card').each((index, cardSet) => {
        let dynamicCards = [];
        let popouts = [];
        $(cardSet).children().each((index, card) => {
            $popout = $("span.card-content", card)
            if($popout.length > 0){
                dynamicCards.push(card)
                $popout.each((index, po) => popouts.push(po))
            }
        });

        $(popouts).css('display', 'table')
        $(popouts).hide()

        $(dynamicCards).css('cursor', 'pointer')
        $(dynamicCards).click((event) => {
            let target = event.currentTarget;
            $(popouts).hide()
            
            if(target.isCardOpen){
                target.isCardOpen = false
            } else{
                target.isCardOpen = true
                $('span.card-content', event.currentTarget).show()

            }
        })

    })
})
