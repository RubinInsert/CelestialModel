document.addEventListener('DOMContentLoaded', function() {
const DOMFlipcards = document.querySelectorAll('.flip-card'); // List of all flipcards on the document
DOMFlipcards.forEach(function(flipCardElement) {
    flipCardElement.addEventListener('click', function(e) { // Add a click event to each flipcard

        const target = e.currentTarget; // Get the target of the click event
        console.log(target.classList);
        if (target.classList.contains('flip-card')) {
            
            target.classList.toggle('flipped');
        }
        });
    });

});
